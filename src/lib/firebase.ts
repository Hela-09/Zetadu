import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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

let app: FirebaseApp | undefined;
let auth: Auth | any = null;
let db: Firestore | any = null;
let storage: any = null;
const googleProvider = new GoogleAuthProvider();

try {
  if (firebaseConfig.apiKey) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    
    // Explicitly connect to the named database: ai-studio-zetadu-c6308d9c-0c0e-4c1f-8911-aa88c989aa89
    db = getFirestore(app, FIRESTORE_DATABASE_ID);

    storage = getStorage(app);
  } else {
    console.warn("Firebase configuration is missing.");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { app, auth, db, storage, googleProvider };
