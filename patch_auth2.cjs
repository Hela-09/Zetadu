const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

code = code.replace(
  '        // Ensure user document exists in Firestore\n        try {\n          const userRef = doc(db, \'users\', currentUser.uid);',
  '        // Ensure user document exists in Firestore\n        try {\n          if (!db) throw new Error("Firestore is not initialized.");\n          const userRef = doc(db, \'users\', currentUser.uid);'
);

code = code.replace(
  '  const refreshProfile = async () => {\n    if (user) {\n      const docSnap = await getDoc(doc(db, \'users\', user.uid));',
  '  const refreshProfile = async () => {\n    if (user && db) {\n      const docSnap = await getDoc(doc(db, \'users\', user.uid));'
);

code = code.replace(
  '    if (user) {\n      try {\n        await setDoc(doc(db, \'settings\', user.uid), updated, { merge: true });',
  '    if (user && db) {\n      try {\n        await setDoc(doc(db, \'settings\', user.uid), updated, { merge: true });'
);

fs.writeFileSync('src/contexts/AuthContext.tsx', code);
