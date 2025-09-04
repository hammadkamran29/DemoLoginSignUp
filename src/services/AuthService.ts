/**
 * Authentication Services
 */
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import { firebaseConfig } from '../config/firebase';

// Configure Google Sign-In based on platform
const webClientId = Platform.OS === 'android' 
  ? firebaseConfig.android.webClientId 
  : firebaseConfig.ios.clientId;

GoogleSignin.configure({
  webClientId
});

export class AuthService {
  /**
   * Sign in with Google
   */
  static async signInWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get the user's ID token
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult.data?.idToken;
      
      if (!idToken) {
        throw new Error('No ID token received from Google Sign-In');
      }
      
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      return userCredential.user;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  }

  /**
   * Sign out the current user
   */
  static async signOut() {
    try {
      // Sign out from Google
      await GoogleSignin.signOut();
      
      // Sign out from Firebase
      await auth().signOut();
    } catch (error) {
      console.error('Sign-Out Error:', error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  static getCurrentUser() {
    return auth().currentUser;
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChanged(callback: (user: any) => void) {
    return auth().onAuthStateChanged(callback);
  }

  /**
   * Check if user is signed in
   */
  static isSignedIn() {
    return auth().currentUser !== null;
  }
}
