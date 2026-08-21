const fs = require('fs');
let code = `import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hale-generator-95g21",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:225999613942:web:578378a897b656b480a1d7",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAyarvFnSe7-CaxTfwsO24jqBM18Vl0TIo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "hale-generator-95g21.firebaseapp.com",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hale-generator-95g21.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "225999613942",
};

let app: FirebaseApp | undefined;
let auth: Auth | any = null;
let db: Firestore | any = null;
const googleProvider = new GoogleAuthProvider();

try {
  if (firebaseConfig.apiKey) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    setPersistence(auth, browserLocalPersistence).catch(console.warn);
    db = getFirestore(app, import.meta.env.VITE_FIREBASE_DATABASE_ID || "ai-studio-educore-c6308d9c-0c0e-4c1f-8911-aa88c989aa89");
  } else {
    console.warn("Firebase configuration is missing.");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { app, auth, db, googleProvider };
`;
fs.writeFileSync('src/firebase/config.ts', code);
