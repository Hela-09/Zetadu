const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

code = code.replace(
  "              uid: currentUser.uid,\n              name: currentUser.displayName || '',\n              email: currentUser.email || '',\n              educationLevel: 'Secondary', // Default\n              country: 'International', // Default\n              progress: 0,\n              createdAt: new Date().toISOString(),\n              ...(isFirst ? { role: 'super_admin', isSuperAdmin: true } : { role: 'student', isSuperAdmin: false })\n            };",
  "              uid: currentUser.uid,\n              email: currentUser.email || '',\n              displayName: currentUser.displayName || '',\n              name: currentUser.displayName || '',\n              photoURL: currentUser.photoURL || '',\n              educationLevel: 'Secondary', // Default\n              country: 'International', // Default\n              progress: 0,\n              createdAt: new Date().toISOString(),\n              updatedAt: new Date().toISOString(),\n              ...(isFirst ? { role: 'super_admin', isSuperAdmin: true } : { role: 'student', isSuperAdmin: false })\n            };"
);

fs.writeFileSync('src/contexts/AuthContext.tsx', code);
