import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence, Auth } from "firebase/auth";
import { initializeFirestore, memoryLocalCache, setLogLevel, getFirestore, Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Suppress Firestore internal SDK logs for resource-exhaustion / backoff delays
try {
  setLogLevel("silent");
} catch (_) {}

// Global guard: Downgrade unavoidable Firestore quota backoff logs so they do not crash or show as unhandled errors
if (typeof window !== "undefined") {
  const originalConsoleError = console.error;
  console.error = function (...args: any[]) {
    const errorString = args
      .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg)))
      .join(" ");

    if (
      errorString.includes("resource-exhausted") ||
      errorString.includes("Using maximum backoff delay") ||
      errorString.includes("Quota limit exceeded") ||
      errorString.includes("quota metric 'Free daily write units")
    ) {
      // Record exhaustion so future client writes can safely fallback to local storage
      try {
        localStorage.setItem("zetadu_firestore_quota_exhausted", Date.now().toString());
      } catch (_) {}
      console.warn("[Firestore Quota Notice] Handled gracefully. Operating in local cache mode.");
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

const firebaseConfig = {
  // HARDCODED to guarantee ALL domains use the exact same Zetadu Firebase project
  // and auth handler (educore-66491). Bypasses any conflicting environment variables.
  apiKey: "AIzaSyBzS_kYtaSYSAx39DBhNAP6l6IGsIUHTqs",
  authDomain: "educore-66491.firebaseapp.com",
  projectId: "educore-66491",
  storageBucket: "educore-66491.firebasestorage.app",
  messagingSenderId: "1042086916215",
  appId: "1:1042086916215:web:6b6bce4648c9fb88b8d672",
  measurementId: "G-J6WZQCSEYF"
};

export const FIRESTORE_DATABASE_ID = (typeof import.meta !== "undefined" && import.meta.env?.VITE_FIREBASE_DATABASE_ID) || "ai-studio-zetadu-c6308d9c-0c0e-4c1f-8911-aa88c989aa89";

// Clear any stuck IndexedDB queues from prior sessions
if (typeof window !== "undefined" && window.indexedDB) {
  try {
    window.indexedDB.deleteDatabase("firestore/[DEFAULT]/" + firebaseConfig.projectId + "/" + FIRESTORE_DATABASE_ID);
    window.indexedDB.deleteDatabase("firestore/[DEFAULT]/" + firebaseConfig.projectId);
  } catch (_) {}
}

let app: FirebaseApp | undefined;
let auth: Auth | any = null;
let db: Firestore | any = null;
let storage: any = null;
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

try {
  if (firebaseConfig.apiKey) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    
    // Explicitly connect to the named database with memoryLocalCache to prevent endless IndexedDB backoff retries
    try {
      db = initializeFirestore(app, {
        localCache: memoryLocalCache()
      }, FIRESTORE_DATABASE_ID);
    } catch (_) {
      db = getFirestore(app, FIRESTORE_DATABASE_ID);
    }

    storage = getStorage(app);
  } else {
    console.warn("Firebase configuration is missing.");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export function isFirestoreQuotaExhausted(): boolean {
  try {
    const ts = localStorage.getItem("zetadu_firestore_quota_exhausted");
    if (!ts) return false;
    const time = parseInt(ts, 10);
    // Suppress cloud writes for 2 hours after hitting daily write limit, relying on local storage
    if (Date.now() - time < 2 * 60 * 60 * 1000) {
      return true;
    }
  } catch (_) {}
  return false;
}

export function recordFirestoreQuotaExhausted(): void {
  try {
    localStorage.setItem("zetadu_firestore_quota_exhausted", Date.now().toString());
  } catch (_) {}
}

export { app, auth, db, storage, googleProvider };
