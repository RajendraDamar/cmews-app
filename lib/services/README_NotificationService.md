# Firebase Cloud Messaging (FCM) Configuration Guide

This guide explains how to configure Firebase Cloud Messaging (FCM) for push notifications in the CMEWS app.

## Overview

The CMEWS app uses:
- **expo-notifications** for cross-platform push notification support (iOS, Android, Web)
- **Firebase Cloud Messaging** for sending notifications from backend/server
- **Mock notification data** for testing without a live Firebase project

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Notification Flow                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Firebase Console/Backend                                    │
│         │                                                     │
│         ▼                                                     │
│  FCM Server ──────► Expo Push Service ──────► Device        │
│                                                │              │
│                                                ▼              │
│                                      NotificationService     │
│                                                │              │
│                                                ▼              │
│                                      User sees notification  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Files Created

### 1. NotificationService.ts
**Location:** `/lib/services/NotificationService.ts`

Main service for handling notifications:
- Request notification permissions
- Register for push notifications
- Send local notifications
- Schedule notifications
- Handle notification taps
- Manage notification listeners

**Key Methods:**
```typescript
notificationService.requestPermissions()        // Request user permission
notificationService.registerForPushNotifications() // Get push token
notificationService.sendLocalNotification()     // Send immediate notification
notificationService.scheduleNotification()      // Schedule for later
```

### 2. notification-mock.ts
**Location:** `/lib/data/notification-mock.ts`

Mock notification data and sender utilities:
- 8 pre-configured weather notifications (alerts, warnings, forecasts)
- MockNotificationSender utility class
- Helper methods for different notification types

**Example Usage:**
```typescript
import { MockNotificationSender } from '~/lib/data/notification-mock';

// Send random notification
await MockNotificationSender.sendRandomNotification();

// Send weather alert
await MockNotificationSender.sendWeatherAlert('Jakarta', 'Hujan lebat', 'warning');

// Send maritime warning
await MockNotificationSender.sendMaritimeWarning('Laut Jawa', '2.5-4.0 meter', 'warning');
```

### 3. notification-demo.tsx
**Location:** `/app/notification-demo.tsx`

Demo screen for testing notifications:
- Permission status display
- Quick action buttons
- View scheduled notifications
- Send all mock notifications
- Platform info display

**Access:** Navigate to `/notification-demo` in the app

## Setup Instructions

### Step 1: Install Dependencies
Dependencies are already installed:
```bash
npm install expo-notifications
```

### Step 2: Configure Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project or create a new one
3. Go to **Project Settings** > **Cloud Messaging**
4. Note the following:
   - **Sender ID** (Messaging Sender ID)
   - **Server Key** (for backend sending)
   - **VAPID Key** (for web push)

### Step 3: Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
EXPO_PUBLIC_FIREBASE_SERVER_KEY=your-server-key
EXPO_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key
```

### Step 4: Configure Native Platforms

#### Android Setup

1. Download `google-services.json` from Firebase Console:
   - Go to **Project Settings** > **Your apps**
   - Select Android app (or add new Android app)
   - Download `google-services.json`
   
2. Place it in the project root:
   ```
   /home/runner/work/cmews-app/cmews-app/google-services.json
   ```

3. The `app.json` is already configured with:
   ```json
   {
     "android": {
       "googleServicesFile": "./google-services.json",
       "package": "com.cmews.app",
       "permissions": [
         "RECEIVE_BOOT_COMPLETED",
         "VIBRATE",
         "INTERNET"
       ]
     }
   }
   ```

#### iOS Setup

1. Download `GoogleService-Info.plist` from Firebase Console:
   - Go to **Project Settings** > **Your apps**
   - Select iOS app (or add new iOS app)
   - Download `GoogleService-Info.plist`

2. Place it in the project root:
   ```
   /home/runner/work/cmews-app/cmews-app/GoogleService-Info.plist
   ```

3. Add to `app.json`:
   ```json
   {
     "ios": {
       "googleServicesFile": "./GoogleService-Info.plist",
       "supportsTablet": true
     }
   }
   ```

### Step 5: Prebuild Native Projects (if needed)

If you're developing with native code:
```bash
npx expo prebuild
```

This will:
- Generate `android/` and `ios/` directories
- Configure Firebase SDKs
- Set up notification capabilities

## Usage

### In Your App Code

#### 1. Initialize Notification Service

```typescript
import { notificationService } from '~/lib/services/NotificationService';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Request permissions and register
    async function setupNotifications() {
      const token = await notificationService.registerForPushNotifications();
      console.log('Push token:', token);
    }
    
    setupNotifications();
  }, []);
}
```

#### 2. Listen for Notifications

```typescript
useEffect(() => {
  // Notification received while app is open
  const receivedListener = notificationService.addNotificationReceivedListener(
    (notification) => {
      console.log('Received:', notification);
    }
  );

  // User tapped notification
  const responseListener = notificationService.addNotificationResponseReceivedListener(
    (response) => {
      console.log('Tapped:', response);
      // Navigate to relevant screen
      router.push('/forecast');
    }
  );

  return () => {
    notificationService.removeNotificationSubscription(receivedListener);
    notificationService.removeNotificationSubscription(responseListener);
  };
}, []);
```

#### 3. Send Local Notifications

```typescript
import { MockNotificationSender } from '~/lib/data/notification-mock';

// Send weather alert
await MockNotificationSender.sendWeatherAlert(
  'Jakarta',
  'Hujan lebat dan petir',
  'warning'
);

// Send maritime warning
await MockNotificationSender.sendMaritimeWarning(
  'Laut Jawa',
  '2.5-4.0 meter',
  'danger'
);

// Send daily forecast
await MockNotificationSender.sendDailyForecast(
  'Surabaya',
  'Cerah berawan',
  '27-32°C'
);
```

#### 4. Schedule Notifications

```typescript
import { notificationService } from '~/lib/services/NotificationService';

// Schedule for specific time
await notificationService.scheduleNotification(
  {
    title: '🌡️ Daily Forecast',
    body: 'Good morning! Check today\'s weather forecast.',
    data: { type: 'forecast' }
  },
  {
    hour: 7,
    minute: 0,
    repeats: true // Daily at 7 AM
  }
);
```

## Testing Notifications

### Method 1: Use the Demo Screen

1. Run the app: `npm start`
2. Navigate to `/notification-demo` route
3. Click "Request Permission" if needed
4. Use the quick action buttons to test:
   - Send Random Notification
   - Send Weather Alert
   - Send Maritime Warning
   - Schedule Test Notifications

### Method 2: Programmatic Testing

```typescript
import { MockNotificationSender } from '~/lib/data/notification-mock';

// Send random mock notification
await MockNotificationSender.sendRandomNotification();

// Send specific notification by index (0-7)
await MockNotificationSender.sendNotificationByIndex(0);

// Schedule multiple test notifications
await MockNotificationSender.scheduleTestNotifications();
// This schedules: immediate, +1 minute, +5 minutes
```

### Method 3: Test from Backend

Use the Expo Push Notification Tool:
1. Get your push token from the demo screen
2. Go to https://expo.dev/notifications
3. Enter your token and message
4. Send test notification

## Notification Types

The app supports these notification types:

### 1. Weather Alert
```typescript
{
  type: 'weather_alert',
  severity: 'warning',
  location: 'Jakarta',
  weatherCondition: 'heavy_rain'
}
```

### 2. Early Warning
```typescript
{
  type: 'early_warning',
  severity: 'danger',
  location: 'Bali',
  magnitude: 5.2,
  tsunamiThreat: false
}
```

### 3. Maritime Warning
```typescript
{
  type: 'maritime',
  severity: 'warning',
  location: 'Laut Jawa',
  waveHeight: '2.5-4.0 meter'
}
```

### 4. Forecast Update
```typescript
{
  type: 'forecast',
  severity: 'info',
  location: 'Surabaya',
  weatherCondition: 'partly_cloudy',
  tempRange: '27-32°C'
}
```

## Severity Levels

- **info** (Blue): General information, daily forecasts
- **warning** (Orange): Weather warnings, maritime alerts
- **danger** (Red): Critical warnings, emergency alerts

## Backend Integration

To send notifications from your backend:

### Using Firebase Admin SDK (Node.js)

```javascript
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Send to specific device
await admin.messaging().send({
  token: deviceToken,
  notification: {
    title: '⚠️ Peringatan Cuaca',
    body: 'Hujan lebat diprediksi di Jakarta'
  },
  data: {
    type: 'weather_alert',
    severity: 'warning',
    location: 'Jakarta'
  },
  android: {
    priority: 'high',
    notification: {
      color: '#FF6B35',
      sound: 'default'
    }
  },
  apns: {
    payload: {
      aps: {
        sound: 'default',
        badge: 1
      }
    }
  }
});
```

### Using Expo Push API

```javascript
const sendPushNotification = async (expoPushToken, message) => {
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: expoPushToken,
      sound: 'default',
      title: message.title,
      body: message.body,
      data: message.data,
      priority: 'high',
      channelId: 'default'
    }),
  });
  
  return await response.json();
};
```

## Troubleshooting

### Permissions Not Working
- Check that you've called `requestPermissions()` before sending notifications
- On iOS, permissions must be requested explicitly
- On Android API 33+, notification permission is required

### Notifications Not Showing
- Verify notification handler is configured (check `NotificationService.ts`)
- Ensure app has notification permissions
- Check device notification settings
- For Android, verify notification channel is created

### Push Token Not Generated
- Ensure Firebase credentials are correct in `.env`
- Check that `google-services.json` (Android) or `GoogleService-Info.plist` (iOS) is in place
- Verify network connectivity
- Check console logs for errors

### Scheduled Notifications Not Firing
- Verify trigger configuration is correct
- Check that notifications weren't cancelled
- Use `getScheduledNotifications()` to verify they're scheduled

## Platform-Specific Notes

### Web
- Uses Firebase Cloud Messaging (FCM) for web push
- Requires VAPID key configuration
- User must grant browser notification permission
- Service worker automatically configured by Expo

### iOS
- Requires APNs (Apple Push Notification service)
- Must have valid provisioning profile
- Notifications won't work on iOS Simulator (use real device)
- Background notifications require Background Modes capability

### Android
- Uses FCM (Firebase Cloud Messaging)
- Works on emulator and real devices
- Requires google-services.json
- Notification channels supported on Android 8+

## Best Practices

1. **Request permissions at the right time**: Don't request on app launch. Wait until user performs an action that needs notifications.

2. **Provide value**: Only send notifications that provide value to users (weather alerts, warnings).

3. **Use appropriate severity**: Match severity level to actual urgency.

4. **Handle notification taps**: Navigate users to relevant content when they tap notifications.

5. **Test thoroughly**: Test on all platforms (iOS, Android, Web) before production.

6. **Respect user preferences**: Allow users to opt-out or customize notification types.

## Security Considerations

- Never commit `google-services.json` or `GoogleService-Info.plist` to version control
- Keep Firebase server keys secure (use environment variables)
- Validate notification payloads on the backend
- Use Firebase Security Rules to protect user data
- Implement rate limiting for notification sending

## Resources

- [Expo Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Expo Push Notifications Guide](https://docs.expo.dev/push-notifications/overview/)
- [Firebase Console](https://console.firebase.google.com/)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Expo notifications documentation
3. Check Firebase console for error logs
4. Test with the `/notification-demo` screen in the app
