import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut as firebaseSignOut, onAuthStateChanged, getIdToken } from 'firebase/auth';
import { auth, googleProvider, db, isFirestoreQuotaExhausted } from '../lib/firebase';
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

// Module-level initial redirect promise to ensure getRedirectResult is called once when app starts
let redirectResultPromise: Promise<{ user: User; credential: any } | null> | null = null;

function handleRedirectOnAppStart(): Promise<{ user: User; credential: any } | null> {
  if (!redirectResultPromise && typeof window !== 'undefined' && auth) {
    redirectResultPromise = (async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          console.log("[Auth] Firebase Google redirect sign-in succeeded for:", result.user.email);
          const credential = GoogleAuthProvider.credentialFromResult(result);
          return { user: result.user, credential };
        }
        return null;
      } catch (err: any) {
        // Critical error logging as requested
        console.error("Firebase Google Redirect Auth Error [CRITICAL]:", err?.code, err?.message, err);
        return null;
      }
    })();
  }
  return redirectResultPromise || Promise.resolve(null);
}

// Immediately trigger getRedirectResult when the module executes
handleRedirectOnAppStart();

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

          if (isActualSuperAdmin && !data.isSuperAdmin) {
            data.role = 'super_admin';
            data.isSuperAdmin = true;
            setDoc(userRef, { role: 'super_admin', isSuperAdmin: true }, { merge: true }).catch(() => {});
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
        // App waits for getRedirectResult to finish before deciding on authentication state
        const redirectData = await handleRedirectOnAppStart();

        if (redirectData?.credential?.accessToken) {
          setOauthToken(redirectData.credential.accessToken);
        }

        const effectiveUser = redirectData?.user || currentUser || auth.currentUser;

        if (effectiveUser) {
          await setupUserProfile(effectiveUser);
          if (isSubscribed) {
            setUser(effectiveUser);
            setLoading(false);
          }
        } else {
          // Both getRedirectResult and onAuthStateChanged confirmed no active user
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
        console.error("Firebase Auth State Resolution Error [CRITICAL]:", err?.code, err?.message, err);
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

  const clearError = () => setError(null);

  const signInWithGoogle = async () => {
    if (!auth) {
      setError("Authentication server is currently unavailable. Please try again later.");
      return;
    }
    setError(null);
    try {
      // Check if environment is mobile device or installed standalone PWA
      const isStandalone = 
        (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) ||
        (typeof window !== 'undefined' && (window.navigator as any).standalone === true) ||
        (typeof document !== 'undefined' && document.referrer.includes('android-app://'));

      const isMobileDevice = 
        typeof navigator !== 'undefined' && (
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
          (navigator.maxTouchPoints > 1 && /Macintosh/i.test(navigator.userAgent))
        );

      const shouldUseRedirect = isStandalone || isMobileDevice;

      if (shouldUseRedirect) {
        // Record redirect pending state across storage
        try {
          sessionStorage.setItem('zetadu_auth_redirect_in_progress', 'true');
          localStorage.setItem('zetadu_auth_redirect_in_progress', 'true');
          localStorage.setItem('zetadu_auth_redirect_time', Date.now().toString());
        } catch (_) {}

        // Trigger Firebase Google Authentication with redirect
        await signInWithRedirect(auth, googleProvider);
      } else {
        // Desktop: keep existing popup flow working
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
          if (err.code === "auth/popup-blocked") {
            // Popup blocked on desktop, fallback to redirect
            try {
              sessionStorage.setItem('zetadu_auth_redirect_in_progress', 'true');
              localStorage.setItem('zetadu_auth_redirect_in_progress', 'true');
              localStorage.setItem('zetadu_auth_redirect_time', Date.now().toString());
            } catch (_) {}
            await signInWithRedirect(auth, googleProvider);
            return;
          }
          throw err;
        }
      }
    } catch (err: any) {
      console.error("Firebase Google Sign-In Error [CRITICAL]:", err?.code, err?.message, err);
      try {
        sessionStorage.removeItem('zetadu_auth_redirect_in_progress');
        localStorage.removeItem('zetadu_auth_redirect_in_progress');
        localStorage.removeItem('zetadu_auth_redirect_time');
      } catch (_) {}

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
      sessionStorage.removeItem("zetadu_auth_redirect_in_progress");
      localStorage.removeItem("zetadu_auth_redirect_in_progress");
      localStorage.removeItem("zetadu_auth_redirect_time");
      
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
    <AuthContext.Provider value={{ user, userProfile, refreshProfile, settings, updateSettings, isSuperAdmin, loading, error, signInWithGoogle, signOut, getToken, clearError, setError, oauthToken }}>
      {children}
    </AuthContext.Provider>
  );
};
