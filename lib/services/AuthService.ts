import { auth } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

export class AuthService {
  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  signOut() {
    return firebaseSignOut(auth);
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  getCurrentUser() {
    return auth.currentUser;
  }
}
