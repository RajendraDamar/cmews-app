import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { getFirebaseMessaging } from '~/lib/firebase';

export const REGISTER_SERVER_URL =
  process.env.EXPO_PUBLIC_REGISTER_SERVER_URL ?? 'https://excuse-qualifier-baguette.ngrok-free.dev';

const CHANNELS = {
  info: 'cmews-info',
  waspada: 'cmews-waspada',
  siaga: 'cmews-siaga',
  awas: 'cmews-awas',
  awasLegacy: 'awas',
} as const;

let hasInitializedNotificationHandler = false;

function getRegisterEndpoint(baseUrl: string): string {
  const trimmed = baseUrl.trim().replace(/\/+$/, '');
  return `${trimmed}/api/register-device`;
}

export async function setupNotificationChannels(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(CHANNELS.info, {
    name: 'CMEWS Info',
    importance: Notifications.AndroidImportance.LOW,
    sound: undefined,
  });

  await Notifications.setNotificationChannelAsync(CHANNELS.waspada, {
    name: 'CMEWS Waspada',
    importance: Notifications.AndroidImportance.DEFAULT,
    lightColor: '#FFD700',
  });

  await Notifications.setNotificationChannelAsync(CHANNELS.siaga, {
    name: 'CMEWS Siaga',
    importance: Notifications.AndroidImportance.HIGH,
    lightColor: '#FF8C00',
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    vibrationPattern: [0, 300, 120, 300],
  });

  const awasChannelConfig: Notifications.NotificationChannelInput = {
    name: 'CMEWS Awas',
    importance: Notifications.AndroidImportance.MAX,
    lightColor: '#FF0000',
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    vibrationPattern: [0, 500, 200, 500, 200, 700],
    sound: 'default',
  };

  await Notifications.setNotificationChannelAsync(CHANNELS.awas, awasChannelConfig);
  await Notifications.setNotificationChannelAsync(CHANNELS.awasLegacy, awasChannelConfig);
}

export function configureForegroundNotifications(): void {
  if (hasInitializedNotificationHandler) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  hasInitializedNotificationHandler = true;
}

export async function registerNativePushToken(baseUrl: string = REGISTER_SERVER_URL): Promise<string | null> {
  if (Platform.OS === 'web') {
    console.log('1️⃣ [PUSH-WEB] Requesting browser notification permission...');
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      throw new Error('Browser notification permissions were not granted.');
    }

    const messaging = await getFirebaseMessaging();
    if (!messaging) {
      throw new Error('Firebase Messaging is not supported in this browser.');
    }

    const vapidKey = process.env.EXPO_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      throw new Error('Missing EXPO_PUBLIC_FIREBASE_VAPID_KEY in environment.');
    }

    console.log('2️⃣ [PUSH-WEB] Fetching web FCM token...');
    const { getToken } = await import('firebase/messaging');
    const webToken = await getToken(messaging, { vapidKey });

    console.log('3️⃣ [PUSH-WEB] Registering token with backend...');
    const response = await fetch(getRegisterEndpoint(baseUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify({
        token: webToken,
        deviceName: 'web-pwa',
      }),
    });

    if (!response.ok) {
      const serverError = await response.text();
      throw new Error(`Web device registration failed (${response.status}): ${serverError}`);
    }

    console.log('4️⃣ [PUSH-WEB] Successfully registered Web PWA!');
    return webToken;
  }

  const permission = await Notifications.getPermissionsAsync();
  let finalStatus = permission.status;

  if (finalStatus !== 'granted') {
    const requestedPermission = await Notifications.requestPermissionsAsync();
    finalStatus = requestedPermission.status;
  }

  if (finalStatus !== 'granted') {
    throw new Error('Notification permissions were not granted.');
  }

  const nativeTokenResponse = await Notifications.getDevicePushTokenAsync();
  const nativeToken = nativeTokenResponse.data;

  if (!nativeToken || typeof nativeToken !== 'string') {
    throw new Error('Failed to obtain native push token.');
  }

  const response = await fetch(getRegisterEndpoint(baseUrl), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify({
      token: nativeToken,
      deviceName: `${Platform.OS}-device`,
    }),
  });

  if (!response.ok) {
    const serverError = await response.text();
    throw new Error(`Device registration failed (${response.status}): ${serverError}`);
  }

  return nativeToken;
}

export async function initializePushNotifications(baseUrl: string = REGISTER_SERVER_URL): Promise<string | null> {
  configureForegroundNotifications();
  await setupNotificationChannels();
  return registerNativePushToken(baseUrl);
}
