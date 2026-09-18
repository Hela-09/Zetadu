import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, onAuthStateChanged, getIdToken } from 'firebase/auth';
import { auth, googleProvider, db, isFirestoreQuotaExhausted } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, increment, onSnapshot } from 'firebase/firestore';
import { jambOfflineDb } from '../services/jambOfflineDb';

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
  awardQuestionProgress: (params: { xpToAdd: number; questionId?: string; isCorrect?: boolean; subject?: string }) => Promise<void>;
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
  const userSetupInProgressRef = useRef<string | null>(null);

  const setupUserProfile = async (currentUser: User): Promise<void> => {
    if (!currentUser) return;
    
    // Prevent concurrent executions for the exact same UID
    if (userSetupInProgressRef.current === currentUser.uid) {
      return;
    }
    userSetupInProgressRef.current = currentUser.uid;

    try {
      if (!db) {
        console.warn("Firestore is not initialized.");
        setUser(currentUser);
        setLoading(false);
        return;
      }

      const userRef = doc(db, 'users', currentUser.uid);
      const isActualSuperAdmin = currentUser.email === 'emmanuelomojola07@gmail.com';
      setIsSuperAdmin(isActualSuperAdmin);

      // 1. Immediately hydrate from local cache if available so UI renders instantly
      let currentLocalProfile: any = null;
      try {
        const cached = localStorage.getItem(`zetadu_profile_${currentUser.uid}`);
        if (cached) {
          currentLocalProfile = JSON.parse(cached);
          if (currentLocalProfile.disabled === true || currentLocalProfile.status === 'disabled') {
            await signOut();
            setError("This account has been disabled by an administrator. Access is revoked.");
            setLoading(false);
            userSetupInProgressRef.current = null;
            return;
          }
          setUserProfile(currentLocalProfile);

          // Also restore cached settings immediately
          const cachedSettings = localStorage.getItem(`zetadu_settings_${currentUser.uid}`);
          if (cachedSettings) {
            setSettings({ ...defaultSettings, ...JSON.parse(cachedSettings) });
          }

          // Render home/dashboard immediately without waiting for network requests
          setUser(currentUser);
          setLoading(false);
        }
      } catch (_) {}

      // 2. Fetch or initialize user document safely (handles quota limits without crashing)
      try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Check if account has been disabled by super admin
          if (data.disabled === true || data.status === 'disabled') {
            console.warn("[Auth] Account is disabled by administrator.");
            await signOut();
            setError("This account has been disabled by an administrator. Access is revoked.");
            setLoading(false);
            userSetupInProgressRef.current = null;
            return;
          }

          // Ensure profile has the latest info from Google auth
          const updates: any = {};
          if (currentUser.email && (!data.email || data.email !== currentUser.email)) {
            updates.email = currentUser.email;
            data.email = currentUser.email;
          }
          if (currentUser.displayName && (!data.displayName || !data.name)) {
            updates.displayName = currentUser.displayName;
            updates.name = currentUser.displayName;
            data.displayName = currentUser.displayName;
            data.name = currentUser.displayName;
          }
          if (currentUser.photoURL && (!data.photoURL || data.photoURL !== currentUser.photoURL)) {
            updates.photoURL = currentUser.photoURL;
            data.photoURL = currentUser.photoURL;
          }
          if (isActualSuperAdmin && !data.isSuperAdmin) {
            updates.role = 'super_admin';
            updates.isSuperAdmin = true;
            data.role = 'super_admin';
            data.isSuperAdmin = true;
          }
          if (Object.keys(updates).length > 0 && !isFirestoreQuotaExhausted()) {
            setDoc(userRef, updates, { merge: true }).catch(() => {});
          }

          setUserProfile(data);
          try {
            localStorage.setItem(`zetadu_profile_${currentUser.uid}`, JSON.stringify(data));
          } catch (_) {}
        } else {
          // Check if the email was registered in disabled registry
          try {
            const statusRes = await fetch('/api/auth/check-status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: currentUser.email || '', uid: currentUser.uid })
            });
            if (statusRes.ok) {
              const statusData = await statusRes.json();
              if (statusData.disabled) {
                console.warn("[Auth] Blocked disabled email sign-in attempt.");
                await signOut();
                setError("This account has been disabled by an administrator. Access is revoked.");
                setLoading(false);
                userSetupInProgressRef.current = null;
                return;
              }
            }
          } catch (_) {}

          const generatedUsername = currentUser.email 
            ? currentUser.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') + Math.floor(Math.random() * 1000) 
            : 'user_' + currentUser.uid.substring(0, 6);

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
            isSuperAdmin: isActualSuperAdmin,
            subscriptionStatus: 'active'
          };
          
          setUserProfile(newUserProfile);
          try {
            localStorage.setItem(`zetadu_profile_${currentUser.uid}`, JSON.stringify(newUserProfile));
          } catch (_) {}

          // Write to Firestore asynchronously without blocking on quota errors
          if (!isFirestoreQuotaExhausted()) {
            setDoc(userRef, newUserProfile, { merge: true }).catch((wErr) => {
              console.warn("[Auth] Cloud profile save deferred (quota/offline):", wErr?.message);
            });
          }
        }
      } catch (readErr: any) {
        console.warn("[Auth] Firestore profile read fallback (quota/network):", readErr?.message);
        if (!currentLocalProfile) {
          const fallbackProfile = {
            uid: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || '',
            name: currentUser.displayName || '',
            username: currentUser.email ? currentUser.email.split('@')[0] : 'user',
            photoURL: currentUser.photoURL || '',
            educationLevel: 'Secondary',
            country: 'International',
            progress: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            role: isActualSuperAdmin ? 'super_admin' : 'student',
            isSuperAdmin: isActualSuperAdmin,
            subscriptionStatus: 'active'
          };
          setUserProfile(fallbackProfile);
          try {
            localStorage.setItem(`zetadu_profile_${currentUser.uid}`, JSON.stringify(fallbackProfile));
          } catch (_) {}
        }
      }

      // 3. Load user settings with local cache fallback
      try {
        const cachedSettings = localStorage.getItem(`zetadu_settings_${currentUser.uid}`);
        if (cachedSettings) {
          setSettings({ ...defaultSettings, ...JSON.parse(cachedSettings) });
        }
        const settingsRef = doc(db, 'settings', currentUser.uid);
        const settingsSnap = await getDoc(settingsRef);
        if (!settingsSnap.exists()) {
          if (!isFirestoreQuotaExhausted()) {
            setDoc(settingsRef, { ...defaultSettings, uid: currentUser.uid }).catch(() => {});
          }
        } else {
          const loadedSettings = { ...defaultSettings, ...settingsSnap.data() } as UserSettings;
          setSettings(loadedSettings);
          try {
            localStorage.setItem(`zetadu_settings_${currentUser.uid}`, JSON.stringify(loadedSettings));
          } catch (_) {}
        }
      } catch (sErr) {
        console.warn("[Auth] Settings init fallback:", sErr);
      }

      // 4. Establish real-time listener with error handler to prevent unhandled quota errors
      if (profileUnsubRef.current) profileUnsubRef.current();
      profileUnsubRef.current = onSnapshot(
        userRef,
        (snapshot) => {
          if (snapshot.exists()) {
            let data = snapshot.data();
            if (data.disabled === true || data.status === 'disabled') {
              console.warn("[Auth] Real-time revocation: Account disabled by administrator.");
              signOut().then(() => {
                setError("Your account has been disabled by an administrator. Access is revoked.");
              });
              return;
            }
            if (data.subscriptionStatus === 'active' && data.subscriptionExpires) {
              if (Date.now() > data.subscriptionExpires) {
                data.subscriptionStatus = 'expired';
                setDoc(userRef, { subscriptionStatus: 'expired' }, { merge: true }).catch(() => {});
              }
            }
            setUserProfile(data);
            try {
              localStorage.setItem(`zetadu_profile_${currentUser.uid}`, JSON.stringify(data));
            } catch (_) {}
          }
        },
        (snapshotErr) => {
          // Gracefully suppress listener failures when daily quota is exceeded
          console.warn("[Auth] Real-time profile listener notice (quota/offline):", snapshotErr?.message);
        }
      );

      // 5. Establish settings listener with error handler
      if (settingsUnsubRef.current) settingsUnsubRef.current();
      settingsUnsubRef.current = onSnapshot(
        doc(db, 'settings', currentUser.uid),
        (snapshot) => {
          if (snapshot.exists()) {
            const updated = { ...defaultSettings, ...snapshot.data() } as UserSettings;
            setSettings(updated);
            try {
              localStorage.setItem(`zetadu_settings_${currentUser.uid}`, JSON.stringify(updated));
            } catch (_) {}
          }
        },
        (snapshotErr) => {
          console.warn("[Auth] Real-time settings listener notice (quota/offline):", snapshotErr?.message);
        }
      );

      setUser(currentUser);
    } catch (err: any) {
      console.warn("Error setting up user profile:", err);
      // Still set the user so the user can enter the app even if Firestore had a brief network delay
      setUser(currentUser);
    } finally {
      userSetupInProgressRef.current = null;
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase Auth is not initialized.");
      setLoading(false);
      return;
    }

    let isSubscribed = true;

    // Listen for auth state changes to restore the logged-in user
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          await setupUserProfile(currentUser);
          if (isSubscribed) {
            setUser(currentUser);
            setLoading(false);
          }
        } else {
          // No active user
          if (isSubscribed) {
            if (profileUnsubRef.current) {
              profileUnsubRef.current();
              profileUnsubRef.current = null;
            }
            if (settingsUnsubRef.current) {
              settingsUnsubRef.current();
              settingsUnsubRef.current = null;
            }
            setUser(null);
            setUserProfile(null);
            setSettings(defaultSettings);
            setIsSuperAdmin(false);
            setLoading(false);
          }
        }
      } catch (err: any) {
        console.error("Firebase Auth State Resolution Error:", err?.code, err?.message, err);
        if (isSubscribed) {
          setLoading(false);
        }
      }
    });

    return () => {
      isSubscribed = false;
      unsubscribe();
      if (profileUnsubRef.current) profileUnsubRef.current();
      if (settingsUnsubRef.current) settingsUnsubRef.current();
    };
  }, []);

  const refreshProfile = async () => {
    if (!user || !db) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        setUserProfile(snap.data());
      }
    } catch (e) {
      console.warn("refreshProfile error", e);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    if (user) {
      try {
        localStorage.setItem(`zetadu_settings_${user.uid}`, JSON.stringify(updated));
      } catch (_) {}
      if (db && !isFirestoreQuotaExhausted()) {
        try {
          await setDoc(doc(db, 'settings', user.uid), updated, { merge: true });
        } catch (err) {
          console.warn("Failed to sync settings to Firestore", err);
        }
      }
    }
  };

  const awardQuestionProgress = async (params: { xpToAdd: number; questionId?: string; isCorrect?: boolean; subject?: string }) => {
    const { xpToAdd, questionId, subject } = params;

    // 1. Immediately update in-memory userProfile and localStorage
    setUserProfile((prev: any) => {
      if (!prev) return prev;
      const currentXp = typeof prev.xp === 'number' ? prev.xp : 0;
      const currentAnswered = typeof prev.questionsAnswered === 'number' ? prev.questionsAnswered : 0;
      const updated = {
        ...prev,
        xp: currentXp + xpToAdd,
        questionsAnswered: currentAnswered + 1
      };
      if (user) {
        try {
          localStorage.setItem(`zetadu_profile_${user.uid}`, JSON.stringify(updated));
        } catch (_) {}
      }
      return updated;
    });

    // 2. Track daily question count in localStorage immediately
    if (user) {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const localQKey = `zetadu_today_questions_${user.uid}_${todayStr}`;
        const prevQ = parseInt(localStorage.getItem(localQKey) || '0', 10);
        localStorage.setItem(localQKey, String(prevQ + 1));
      } catch (_) {}
    }

    // 3. Mark question as answered in IndexedDB offline database
    if (questionId) {
      try {
        await jambOfflineDb.markQuestionsAnswered([questionId], subject);
      } catch (err) {
        console.warn('[Auth] markQuestionsAnswered warning:', err);
      }
    }

    // 4. Persist updated stats directly to Firestore
    if (user && db && !isFirestoreQuotaExhausted()) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          xp: increment(xpToAdd),
          questionsAnswered: increment(1)
        });
      } catch (err) {
        try {
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, {
            xp: increment(xpToAdd),
            questionsAnswered: increment(1)
          }, { merge: true });
        } catch (setErr) {
          console.warn('[Auth] Realtime XP Firestore update warning:', setErr);
        }
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
      const result = await signInWithPopup(auth, googleProvider);
      if (result && result.user) {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
          setOauthToken(credential.accessToken);
        }
        await setupUserProfile(result.user);
        setUser(result.user);
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Firebase Google Sign-In Error:", err?.code, err?.message, err);
      if (err.code === 'auth/popup-blocked') {
        setError("Popup blocked by browser. Please allow popups or try again.");
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
      
      if (profileUnsubRef.current) {
        profileUnsubRef.current();
        profileUnsubRef.current = null;
      }
      if (settingsUnsubRef.current) {
        settingsUnsubRef.current();
        settingsUnsubRef.current = null;
      }

      setUser(null);
      setUserProfile(null);
      setIsSuperAdmin(false);

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
    <AuthContext.Provider value={{ user, userProfile, refreshProfile, settings, updateSettings, awardQuestionProgress, isSuperAdmin, loading, error, signInWithGoogle, signOut, getToken, clearError, setError, oauthToken }}>
      {children}
    </AuthContext.Provider>
  );
};
