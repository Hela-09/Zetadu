const fs = require('fs');

let fb = fs.readFileSync('src/lib/firebase.ts', 'utf8');

const strictConfig = `const firebaseConfig = {
  // HARDCODED to guarantee ALL domains use the exact same Zetadu Firebase project
  // and auth handler (educore-66491). Bypasses any conflicting environment variables.
  apiKey: "AIzaSyBzS_kYtaSYSAx39DBhNAP6l6IGsIUHTqs",
  authDomain: "educore-66491.firebaseapp.com",
  projectId: "educore-66491",
  storageBucket: "educore-66491.firebasestorage.app",
  messagingSenderId: "1042086916215",
  appId: "1:1042086916215:web:6b6bce4648c9fb88b8d672",
  measurementId: "G-J6WZQCSEYF"
};`;

fb = fb.replace(/const firebaseConfig = \{[\s\S]*?\};/, strictConfig);

fs.writeFileSync('src/lib/firebase.ts', fb);
