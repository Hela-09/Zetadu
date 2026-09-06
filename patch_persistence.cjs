const fs = require('fs');

let fb = fs.readFileSync('src/lib/firebase.ts', 'utf8');
fb = fb.replace('setPersistence(auth, browserLocalPersistence).catch(console.warn);', '');
fs.writeFileSync('src/lib/firebase.ts', fb);

let login = fs.readFileSync('src/components/Login.tsx', 'utf8');
login = login.replace(
  "import { signInWithEmailAndPassword",
  "import { setPersistence, browserLocalPersistence, signInWithEmailAndPassword"
);
login = login.replace(
  "await signInWithEmailAndPassword(auth, email, password);",
  "await setPersistence(auth, browserLocalPersistence);\n      await signInWithEmailAndPassword(auth, email, password);"
);
login = login.replace(
  "await signInWithGoogle();",
  "await setPersistence(auth, browserLocalPersistence);\n      await signInWithGoogle();"
);
fs.writeFileSync('src/components/Login.tsx', login);

