const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

// Find the block:
// // Super Admin Logic
// ... up to ...
// // Load settings

const startStr = "// Super Admin Logic";
const endStr = "// Load settings";
const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  const newLogic = `// Super Admin Logic
          let isFirst = false;
          let isActualSuperAdmin = currentUser.email === 'emmanuelomojola07@gmail.com';
          
          if (isActualSuperAdmin) {
            setIsSuperAdmin(true);
            isFirst = true; // ensure new profile uses super_admin
            const superAdminRef = doc(db, 'system', 'super_admin');
            const adminData = { 
               uid: currentUser.uid, 
               email: currentUser.email || '',
               displayName: currentUser.displayName || '',
               role: "super_admin",
               isSuperAdmin: true,
               createdAt: new Date().toISOString() 
             };
             
             try {
               await setDoc(superAdminRef, adminData, { merge: true });
               await setDoc(doc(db, 'users', currentUser.uid), { role: 'super_admin', isSuperAdmin: true }, { merge: true });
             } catch(e) {
               console.warn("Failed to set super_admin ref", e);
             }
          } else {
             setIsSuperAdmin(false);
          }
          
          `;
  code = code.substring(0, startIdx) + newLogic + code.substring(endIdx);
  fs.writeFileSync('src/contexts/AuthContext.tsx', code);
  console.log("Patched successfully");
} else {
  console.log("Could not find boundaries");
}
