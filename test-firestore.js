import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBzS_kYtaSYSAx39DBhNAP6l6IGsIUHTqs",
  authDomain: "educore-66491.firebaseapp.com",
  projectId: "educore-66491",
  storageBucket: "educore-66491.firebasestorage.app",
  messagingSenderId: "1042086916215",
  appId: "1:1042086916215:web:6b6bce4648c9fb88b8d672"
};

const DATABASE_ID = "ai-studio-zetadu-c6308d9c-0c0e-4c1f-8911-aa88c989aa89";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, DATABASE_ID);

async function test() {
  await signInAnonymously(auth);
  const snap = await getDocs(collection(db, "users"));
  console.log(`Connected to ${DATABASE_ID}. Found ${snap.docs.length} user(s).`);
  process.exit(0);
}

test().catch(err => {
  console.error("Firestore test error:", err);
  process.exit(1);
});
