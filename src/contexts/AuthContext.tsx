import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut as firebaseSignOut, onAuthStateChanged, getIdToken } from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
      setUser(currentUser);
      
      if (currentUser) {
        // Ensure user document exists in Firestore
        try {
          if (!db) throw new Error("Firestore is not initialized.");
          const userRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userRef);

          // Super Admin Logic
          let isFirst = false;
          let isActualSuperAdmin = false;
          const superAdminRef = doc(db, 'system', 'super_admin');
          const adminData = { 
            uid: currentUser.uid, 
            email: currentUser.email || '',
            username: currentUser.displayName?.toLowerCase().replace(/\s+/g, '') || '',
            displayName: currentUser.displayName || '',
            role: "super_admin",
            isSuperAdmin: true,
            createdAt: new Date().toISOString() 
          };

          try {
            const superAdminSnap = await getDoc(superAdminRef);
            if (superAdminSnap.exists() && superAdminSnap.data().uid === currentUser.uid) {
              setIsSuperAdmin(true);
              isActualSuperAdmin = true;
            }
          } catch(err) {
            // Permission denied -> either we are not admin OR it doesn't exist yet!
            try {
              await setDoc(superAdminRef, adminData);
              // If successful, we claimed it!
              await setDoc(doc(db, 'users', currentUser.uid), adminData, { merge: true });
              setIsSuperAdmin(true);
              isFirst = true;
              isActualSuperAdmin = true;
            } catch(e) {
              // Someone else is super admin
              setIsSuperAdmin(false);
            }
          }

          
          // Load settings
          try {
            const settingsSnap = await getDoc(doc(db, 'settings', currentUser.uid));
            if (settingsSnap.exists()) {
              const loadedSettings = { ...defaultSettings, ...settingsSnap.data() } as UserSettings;
              setSettings(loadedSettings);

            } else {
              await setDoc(doc(db, 'settings', currentUser.uid), { ...defaultSettings, uid: currentUser.uid });
            }
          } catch (err) {
            console.warn("Error loading settings:", err);
          }

          if (!docSnap.exists()) {

            const newUserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              name: currentUser.displayName || '',
              photoURL: currentUser.photoURL || '',
              educationLevel: 'Secondary', // Default
              country: 'International', // Default
              progress: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              ...(isFirst ? { role: 'super_admin', isSuperAdmin: true } : { role: 'student', isSuperAdmin: false })
            };
            await setDoc(userRef, newUserProfile, { merge: true });
            setUserProfile(newUserProfile);
          } else {
            const data = docSnap.data();
            if (isActualSuperAdmin && !data.isSuperAdmin) {
               await setDoc(userRef, { role: 'super_admin', isSuperAdmin: true }, { merge: true });
               data.role = 'super_admin';
               data.isSuperAdmin = true;
            }
            // Check if subscription expired
            let updatedData = { ...data };
            if (data.subscriptionStatus === 'active' && data.subscriptionExpires) {
              if (Date.now() > data.subscriptionExpires) {
                updatedData.subscriptionStatus = 'expired';
                await setDoc(userRef, { subscriptionStatus: 'expired' }, { merge: true });
              }
            }
            setUserProfile(updatedData);
          }

          // Ensure other documents exist with merge to prevent overwriting
          await setDoc(doc(db, 'settings', currentUser.uid), { uid: currentUser.uid }, { merge: true });
          await setDoc(doc(db, 'user_progress', currentUser.uid), { uid: currentUser.uid }, { merge: true });
          await setDoc(doc(db, 'bookmarks', currentUser.uid), { uid: currentUser.uid }, { merge: true });
          await setDoc(doc(db, 'notes', currentUser.uid), { uid: currentUser.uid }, { merge: true });

        } catch (err) {
          console.warn("Error setting up user profile:", err);
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const refreshProfile = async () => {
    if (user && db) {
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) {
        let data = docSnap.data();
        if (data.subscriptionStatus === 'active' && data.subscriptionExpires) {
          if (Date.now() > data.subscriptionExpires) {
            data.subscriptionStatus = 'expired';
            await setDoc(doc(db, 'users', user.uid), { subscriptionStatus: 'expired' }, { merge: true });
          }
        }
        setUserProfile(data);
      }
    }
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
          if (err.code === 'auth/popup-blocked') {
            await signInWithRedirect(auth, googleProvider);
          } else {
            throw err;
          }
        }
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-blocked') {
        setError('Popup blocked by browser. Please allow popups or try opening the app in a new tab.');
      } else if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled. Please try again.');
      } else {
        setError(err.message || 'Failed to sign in with Google.');
      }
    }
  };

  

  const signOut = async () => {
    if (!auth) return;
    try {
      if (user) {
        try {
          // Attempt to delete sessions from Firestore when logging out
          const { deleteDoc } = await import('firebase/firestore');
          await deleteDoc(doc(db, 'practice_sessions', user.uid)).catch(() => {});
          await deleteDoc(doc(db, 'tutor_sessions', user.uid)).catch(() => {});
        } catch(e) {}
      }
      localStorage.removeItem('practice_session');
      localStorage.removeItem('tutor_session');
      localStorage.removeItem('educore_current_view');
      setOauthToken(null);
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
