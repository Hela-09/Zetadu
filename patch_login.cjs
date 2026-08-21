const fs = require('fs');
let code = fs.readFileSync('src/components/Login.tsx', 'utf8');

code = code.replace(
  'await signInWithEmailAndPassword(auth, email, password);',
  'if (!auth) throw new Error("Authentication server is currently unavailable. Please try again later.");\n      await signInWithEmailAndPassword(auth, email, password);'
);

code = code.replace(
  'const userCred = await createUserWithEmailAndPassword(auth, email, password);',
  'if (!auth) throw new Error("Authentication server is currently unavailable. Please try again later.");\n      const userCred = await createUserWithEmailAndPassword(auth, email, password);'
);

code = code.replace(
  'await sendPasswordResetEmail(auth, email);',
  'if (!auth) throw new Error("Authentication server is currently unavailable. Please try again later.");\n      await sendPasswordResetEmail(auth, email);'
);

fs.writeFileSync('src/components/Login.tsx', code);
