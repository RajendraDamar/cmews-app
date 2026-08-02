# AuthService

Firebase Authentication service for email/password authentication.

## Class: `AuthService`

Provides methods for user authentication using Firebase Auth.

### Methods

#### `signIn(email: string, password: string)`
Sign in an existing user with email and password.

**Parameters:**
- `email` - User's email address
- `password` - User's password

**Returns:** Promise resolving to Firebase UserCredential

**Example:**
```typescript
import { AuthService } from '~/lib/services/AuthService';

const authService = new AuthService();
try {
  const userCredential = await authService.signIn('user@example.com', 'password123');
  console.log('Signed in:', userCredential.user.email);
} catch (error) {
  console.error('Sign in failed:', error);
}
```

#### `signUp(email: string, password: string)`
Create a new user account with email and password.

**Parameters:**
- `email` - User's email address
- `password` - User's password

**Returns:** Promise resolving to Firebase UserCredential

**Example:**
```typescript
const authService = new AuthService();
try {
  const userCredential = await authService.signUp('newuser@example.com', 'password123');
  console.log('Account created:', userCredential.user.email);
} catch (error) {
  console.error('Sign up failed:', error);
}
```

#### `signOut()`
Sign out the current user.

**Returns:** Promise<void>

**Example:**
```typescript
const authService = new AuthService();
try {
  await authService.signOut();
  console.log('Signed out successfully');
} catch (error) {
  console.error('Sign out failed:', error);
}
```

#### `onAuthStateChange(callback: (user: User | null) => void)`
Listen for authentication state changes.

**Parameters:**
- `callback` - Function called when auth state changes

**Returns:** Unsubscribe function

**Example:**
```typescript
const authService = new AuthService();
const unsubscribe = authService.onAuthStateChange((user) => {
  if (user) {
    console.log('User signed in:', user.email);
  } else {
    console.log('User signed out');
  }
});

// Later, to stop listening:
unsubscribe();
```

#### `getCurrentUser()`
Get the currently signed-in user.

**Returns:** User | null

**Example:**
```typescript
const authService = new AuthService();
const currentUser = authService.getCurrentUser();
if (currentUser) {
  console.log('Current user:', currentUser.email);
} else {
  console.log('No user signed in');
}
```

## Platform Support
- ✅ iOS
- ✅ Android
- ✅ Web

## Error Handling

All async methods may throw Firebase Auth errors. Common error codes include:
- `auth/email-already-in-use` - Email is already registered
- `auth/invalid-email` - Invalid email format
- `auth/weak-password` - Password is too weak (< 6 characters)
- `auth/user-not-found` - No user found with this email
- `auth/wrong-password` - Incorrect password

Handle errors appropriately in your UI.
