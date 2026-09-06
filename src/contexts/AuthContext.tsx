import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut as firebaseSignOut, onAuthStateChanged, getIdToken } from 'firebase/auth';
import { auth, googleProvider, db } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export interface UserSettings {
  fontSize: "small" | "medium" | "large";
  defaultPracticeDifficulty: "Easy" | "Medium" | "Hard" | "Mixed";
  aiTutorTone: "Friendly" | "Direct" | "Socratic";
}

interface AuthContextType {
  user: User | null;
  userProfile: any | null;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  isSuperAdmin: boolean;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
  oauthToken: string | null;
  clearError: () => void;
  setError: (err: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

const defaultSettings: UserSettings = {
  fontSize: 'medium',
  defaultPracticeDifficulty: 'Medium',
  aiTutorTone: 'Friendly'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [oauthToken, setOauthToken] = useState<string | null>(null);
  
  // Keep track of our unsubscribe functions for cleanup
  const profileUnsubRef = useRef<(() => void) | null>(null);
  const settingsUnsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (auth) {
      getRedirectResult(auth).then(result => {
        if (result) {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential?.accessToken) {
            setOauthToken(credential.accessToken);
          }
        }
      }).catch(err => {
        console.error("Redirect sign-in error", err);
      });
    }
  }, []);

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase Auth is not initialized.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // Clear listeners if user signs out or changes
      if (profileUnsubRef.current) profileUnsubRef.current();
      if (settingsUnsubRef.current) settingsUnsubRef.current();
      
      if (currentUser) {
        try {
          if (!db) throw new Error("Firestore is not initialized.");
          const userRef = doc(db, 'users', currentUser.uid);
          
          let isActualSuperAdmin = currentUser.email === 'emmanuelomojola07@gmail.com';
          setIsSuperAdmin(isActualSuperAdmin);

          // Bootstrap documents if missing
          const docSnap = await getDoc(userRef);
          if (!docSnap.exists()) {
            const generatedUsername = currentUser.email ? currentUser.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') + Math.floor(Math.random() * 1000) : 'user_' + currentUser.uid.substring(0, 6);
            const newUserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              name: currentUser.displayName || '',
              username: generatedUsername,
              photoURL: currentUser.photoURL || '',
              educationLevel: 'Secondary',
              country: 'International',
              progress: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              role: isActualSuperAdmin ? 'super_admin' : 'student',
              isSuperAdmin: isActualSuperAdmin
            };
            await setDoc(userRef, newUserProfile, { merge: true });
            setUserProfile(newUserProfile);
          } else {
             const data = docSnap.data();
             if (isActualSuperAdmin && !data.isSuperAdmin) {
               await setDoc(userRef, { role: 'super_admin', isSuperAdmin: true }, { merge: true });
             }
             setUserProfile(data);
          }
          
          const settingsSnap = await getDoc(doc(db, 'settings', currentUser.uid));
          if (!settingsSnap.exists()) {
              await setDoc(doc(db, 'settings', currentUser.uid), { ...defaultSettings, uid: currentUser.uid });
          } else {
              setSettings({ ...defaultSettings, ...settingsSnap.data() } as UserSettings);
          }

          await setDoc(doc(db, 'user_progress', currentUser.uid), { uid: currentUser.uid }, { merge: true });
          await setDoc(doc(db, 'bookmarks', currentUser.uid), { uid: currentUser.uid }, { merge: true });
          await setDoc(doc(db, 'notes', currentUser.uid), { uid: currentUser.uid }, { merge: true });

          // Establish Real-Time Listeners
          profileUnsubRef.current = onSnapshot(userRef, (snapshot) => {
             if (snapshot.exists()) {
                 let data = snapshot.data();
                 if (data.subscriptionStatus === 'active' && data.subscriptionExpires) {
                    if (Date.now() > data.subscriptionExpires) {
                        data.subscriptionStatus = 'expired';
                        setDoc(userRef, { subscriptionStatus: 'expired' }, { merge: true });
                    }
                 }
                 setUserProfile(data);
             }
          });
          
          settingsUnsubRef.current = onSnapshot(doc(db, 'settings', currentUser.uid), (snapshot) => {
              if (snapshot.exists()) {
                  setSettings({ ...defaultSettings, ...snapshot.data() } as UserSettings);
              }
          });

        } catch (err: any) {
          console.warn("Error setting up user profile:", err);
        }
      } else {
        setUserProfile(null);
        setSettings(defaultSettings);
        setIsSuperAdmin(false);
      }
      
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (profileUnsubRef.current) profileUnsubRef.current();
      if (settingsUnsubRef.current) settingsUnsubRef.current();
    };
  }, []);

  const refreshProfile = async () => {
      // Intentionally left as a stub or force-fetch, but onSnapshot handles live updates
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    if (user && db) {
      try {
        await setDoc(doc(db, 'settings', user.uid), updated, { merge: true });
      } catch (err) {
        console.warn("Failed to sync settings to Firestore", err);
      }
    }
  };

  const clearError = () => setError(null);

  const signInWithGoogle = async () => {
    if (!auth) {
      setError("Authentication server is currently unavailable. Please try again later.");
      return;
    }
    setError(null);
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential?.accessToken) {
            setOauthToken(credential.accessToken);
          }
        } catch (err: any) {
          if (err.code === "auth/popup-blocked") {
            await signInWithRedirect(auth, googleProvider);
          } else {
            throw err;
          }
        }
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-blocked') {
        setError("Popup blocked by browser. Please allow popups or try opening the app in a new tab.");
      } else if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        setError("Sign-in was cancelled. Please try again.");
      } else if (err.code === 'auth/unauthorized-domain') {
        setError("This domain is not authorized for Google Sign-In. Please add it in Firebase Console.");
      } else if (err.code === 'auth/operation-not-allowed') {
        setError("Google Sign-In is not enabled. Please enable it in Firebase Console.");
      } else if (err.code === 'auth/invalid-credential') {
        setError("Invalid credentials provided.");
      } else {
        setError(err.message || 'Failed to sign in with Google.');
      }
    }
  };
  
  const signOut = async () => {
    if (!auth) return;
    try {
      localStorage.removeItem("practice_session");
      localStorage.removeItem("tutor_session");
      localStorage.removeItem("zetadu_current_view");
      
      await firebaseSignOut(auth);
    } catch (error) {
      console.warn("Error signing out", error);
    }
  };

    const getToken = async () => {
    if (!user) return null;
    return await getIdToken(user);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, refreshProfile, settings, updateSettings, isSuperAdmin, loading, error, signInWithGoogle, signOut, getToken, clearError, setError, oauthToken }}>
      {children}
    </AuthContext.Provider>
  );
};
