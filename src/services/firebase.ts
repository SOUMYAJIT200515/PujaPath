import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
  query,
  limit,
  getDocFromServer,
} from 'firebase/firestore';
import type { CrowdReport, Itinerary } from '../types';
import appletConfig from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: appletConfig.apiKey,
  authDomain: appletConfig.authDomain,
  projectId: appletConfig.projectId,
  storageBucket: appletConfig.storageBucket,
  messagingSenderId: appletConfig.messagingSenderId,
  appId: appletConfig.appId,
};

// Initialize or reuse Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Cloud Firestore (support custom databaseId if configured)
const firestoreDbId =
  appletConfig.firestoreDatabaseId && appletConfig.firestoreDatabaseId !== '(default)'
    ? appletConfig.firestoreDatabaseId
    : undefined;

export const db = firestoreDbId ? getFirestore(app, firestoreDbId) : getFirestore(app);

// Connectivity check test
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network restricted.');
    }
    return false;
  }
}

// Authentication Helpers
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      await saveUserProfile(result.user);
    }
    return result.user;
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (
      code === 'auth/popup-closed-by-user' ||
      code === 'auth/cancelled-popup-request' ||
      code === 'auth/user-cancelled'
    ) {
      // User closed the popup without completing sign-in
      return null;
    }
    console.error('Google Sign-in failed:', err);
    throw err;
  }
}

export async function signOutUser(): Promise<void> {
  await fbSignOut(auth);
}

export function subscribeToAuthState(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
    if (user) {
      saveUserProfile(user).catch((e) => console.warn('Failed to save profile:', e));
    }
  });
}

// User Profile Persistence
export async function saveUserProfile(user: FirebaseUser): Promise<void> {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(
      userRef,
      {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Pandal Hopper',
        photoURL: user.photoURL || '',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Could not sync user profile to Firestore:', error);
  }
}

export interface UserSavedPreferences {
  visitedPandalIds: string[];
  favoritePandalIds: string[];
  selectedRegion?: string;
  targetBudget?: number;
}

// Preferences & Progress Persistence
export async function loadUserPreferences(
  userId: string
): Promise<UserSavedPreferences | null> {
  try {
    const prefRef = doc(db, 'users', userId, 'preferences', 'main');
    const snap = await getDoc(prefRef);
    if (snap.exists()) {
      return snap.data() as UserSavedPreferences;
    }
    return null;
  } catch (error) {
    console.warn('Could not load user preferences from Firestore:', error);
    return null;
  }
}

export async function saveUserPreferences(
  userId: string,
  prefs: UserSavedPreferences
): Promise<void> {
  try {
    const prefRef = doc(db, 'users', userId, 'preferences', 'main');
    await setDoc(
      prefRef,
      {
        userId,
        visitedPandalIds: prefs.visitedPandalIds,
        favoritePandalIds: prefs.favoritePandalIds,
        selectedRegion: prefs.selectedRegion || 'ALL',
        targetBudget: prefs.targetBudget || 600,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Could not save user preferences to Firestore:', error);
  }
}

// Itinerary Persistence
export async function saveUserItinerary(
  userId: string,
  itinerary: Itinerary
): Promise<void> {
  try {
    const itinRef = doc(db, 'users', userId, 'itineraries', itinerary.id);
    await setDoc(itinRef, {
      ...itinerary,
      userId,
      savedAt: Date.now(),
    });
  } catch (error) {
    console.warn('Could not save itinerary to Firestore:', error);
  }
}

// Community Crowd Reports Persistence
export async function submitCrowdReportToFirestore(
  report: CrowdReport,
  userId: string
): Promise<void> {
  try {
    const reportRef = doc(db, 'crowdReports', report.id);
    await setDoc(reportRef, {
      ...report,
      userId,
      createdAt: Date.now(),
    });
  } catch (error) {
    console.warn('Could not publish crowd report to Firestore:', error);
  }
}

export function subscribeToCrowdReports(
  onUpdate: (reports: CrowdReport[]) => void
) {
  try {
    const reportsCol = collection(db, 'crowdReports');
    const q = query(reportsCol, limit(50));
    return onSnapshot(
      q,
      (snapshot) => {
        const reports: CrowdReport[] = [];
        snapshot.forEach((docSnap) => {
          reports.push(docSnap.data() as CrowdReport);
        });
        onUpdate(reports);
      },
      (err) => {
        console.warn('Crowd reports snapshot listener error:', err);
      }
    );
  } catch (error) {
    console.warn('Error setting up crowd reports subscription:', error);
    return () => {};
  }
}
