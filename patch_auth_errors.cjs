const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

code = code.replace(
  `} else if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        setError("Sign-in was cancelled. Please try again.");
      } else {`,
  `} else if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        setError("Sign-in was cancelled. Please try again.");
      } else if (err.code === 'auth/unauthorized-domain') {
        setError("This domain is not authorized for Google Sign-In. Please add it in Firebase Console.");
      } else if (err.code === 'auth/operation-not-allowed') {
        setError("Google Sign-In is not enabled. Please enable it in Firebase Console.");
      } else if (err.code === 'auth/invalid-credential') {
        setError("Invalid credentials provided.");
      } else {`
);

fs.writeFileSync('src/contexts/AuthContext.tsx', code);
