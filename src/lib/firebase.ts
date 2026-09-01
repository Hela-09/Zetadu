import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBzS_kYtaSYSAx39DBhNAP6l6IGsIUHTqs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "educore-66491.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "educore-66491",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "educore-66491.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1042086916215",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1042086916215:web:6b6bce4648c9fb88b8d672",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-J6WZQCSEYF"
};

let app: FirebaseApp | undefined;
let auth: Auth | any = null;
let db: Firestore | any = null;
let storage: any = null;
const googleProvider = new GoogleAuthProvider();

try {
  if (firebaseConfig.apiKey) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    setPersistence(auth, browserLocalPersistence).catch(console.warn);
    
    // Use the default database for the new project
    db = getFirestore(app);
    storage = getStorage(app);
  } else {
    console.warn("Firebase configuration is missing.");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { app, auth, db, storage, googleProvider };
