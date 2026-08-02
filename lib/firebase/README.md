# Firebase Integration

This directory contains Firebase configuration and authentication services for the CMEWS app.

## Files

### `config.ts`
Firebase initialization and configuration. Exports:
- `auth` - Firebase Authentication instance
- `db` - Firestore database instance
- `functions` - Firebase Functions instance

### Environment Variables
The following environment variables must be set in a `.env` file (see `.env.example` in the project root):

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key-here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Usage

```typescript
import { auth, db, functions } from '~/lib/firebase/config';

// Use auth, db, or functions as needed
console.log('Current user:', auth.currentUser);
```

## Platform Support
- ✅ iOS
- ✅ Android  
- ✅ Web

All Firebase services work across all platforms using the Firebase JS SDK v10.5.2.
