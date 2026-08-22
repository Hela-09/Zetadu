const fs = require('fs');
let code = fs.readFileSync('src/firebase/config.ts', 'utf8');

if (!code.includes('getStorage')) {
  code = code.replace('from "firebase/firestore";', 'from "firebase/firestore";\nimport { getStorage } from "firebase/storage";');
}
if (!code.includes('let storage:')) {
  code = code.replace('let db: Firestore | any = null;', 'let db: Firestore | any = null;\nlet storage: any = null;');
}
if (code.includes('db = getFirestore(app, databaseId);') && !code.includes('storage = getStorage(app);')) {
  code = code.replace('db = getFirestore(app, databaseId);', 'db = getFirestore(app, databaseId);\n    storage = getStorage(app);');
}
if (code.includes('export { app, auth, db, googleProvider };')) {
  code = code.replace('export { app, auth, db, googleProvider };', 'export { app, auth, db, storage, googleProvider };');
}
fs.writeFileSync('src/firebase/config.ts', code);
console.log('Firebase config patched');
