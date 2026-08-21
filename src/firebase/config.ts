import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import config from "../../firebase-applet-config.json";

// The project id to use
const projectId = config.projectId;

const firebaseConfig = {
  projectId: projectId,
  appId: config.appId,
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  measurementId: config.measurementId
};

let app: FirebaseApp | undefined;
let auth: Auth | any = null;
let db: Firestore | any = null;

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');
googleProvider.addScope('https://www.googleapis.com/auth/drive.metadata.readonly');

try {
  if (firebaseConfig.apiKey) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    setPersistence(auth, browserLocalPersistence).catch(console.warn);
    
    // Check if there is a firestoreDatabaseId in config, else use the known one
    const databaseId = config.firestoreDatabaseId || "ai-studio-educore-c6308d9c-0c0e-4c1f-8911-aa88c989aa89";
    db = getFirestore(app, databaseId);
  } else {
    console.warn("Firebase configuration is missing.");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { app, auth, db, googleProvider };
