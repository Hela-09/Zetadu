const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

const oldProfile = `            const newUserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              name: currentUser.displayName || '',
              photoURL: currentUser.photoURL || '',
              educationLevel: 'Secondary', // Default
              country: 'International', // Default
              progress: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              ...(isFirst ? { role: 'super_admin', isSuperAdmin: true } : { role: 'student', isSuperAdmin: false })
            };`;

const newProfile = `            const generatedUsername = currentUser.email ? currentUser.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') + Math.floor(Math.random() * 1000) : 'user_' + currentUser.uid.substring(0, 6);
            const newUserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              name: currentUser.displayName || '',
              username: generatedUsername,
              photoURL: currentUser.photoURL || '',
              educationLevel: 'Secondary', // Default
              country: 'International', // Default
              progress: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              ...(isFirst ? { role: 'super_admin', isSuperAdmin: true } : { role: 'student', isSuperAdmin: false })
            };`;

code = code.replace(oldProfile, newProfile);
fs.writeFileSync('src/contexts/AuthContext.tsx', code);
console.log("Updated AuthContext.tsx");
