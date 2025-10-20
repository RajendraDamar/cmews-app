import { auth } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

export class AuthService {
  async signIn(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  async signUp(email: string, password: string) {
    return await createUserWithEmailAndPassword(auth, email, password);
  }

  async signOut() {
    return await firebaseSignOut(auth);
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  getCurrentUser() {
    return auth.currentUser;
  }
}
