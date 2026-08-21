const fs = require('fs');
let content = fs.readFileSync('src/firebase/config.ts', 'utf8');

const newConfig = `const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "educore-66491",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1042086916215:web:a8fc2c8277c012d1b8d672",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBzS_kYtaSYSAx39DBhNAP6l6IGsIUHTqs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "educore-66491.firebaseapp.com",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "educore-66491.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1042086916215",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-15CB56MC58"
};`;

content = content.replace(/const firebaseConfig = \{[\s\S]*?\};/, newConfig);
fs.writeFileSync('src/firebase/config.ts', content);
console.log('patched config.ts with new credentials');
