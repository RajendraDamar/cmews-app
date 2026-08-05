// Re-export centralized lazy Firebase initialization from lib/firebase.ts
import { app, auth, db } from '../firebase';
import { getFunctions } from 'firebase/functions';
import { getMessaging, isSupported } from 'firebase/messaging';

export { app, auth, db };
export const functions = getFunctions(app);

// Firebase Cloud Messaging (FCM) - Only available on web
let messaging: ReturnType<typeof getMessaging> | null = null;

if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  }).catch((error) => {
    console.warn('Firebase Messaging not supported in browser environment:', error);
  });
}

export { messaging };
