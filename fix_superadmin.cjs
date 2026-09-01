const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

const oldLogic = `          // Super Admin Logic
          let isFirst = false;
          let isActualSuperAdmin = false;
          const superAdminRef = doc(db, 'system', 'super_admin');
          const adminData = { 
             uid: currentUser.uid, 
             email: currentUser.email || '',
            username: currentUser.displayName?.toLowerCase().replace(/\\s+/g, '') || '',
            displayName: currentUser.displayName || '',
            role: "super_admin",
            isSuperAdmin: true,
            createdAt: new Date().toISOString() 
           };
          try {
            const superAdminSnap = await getDoc(superAdminRef);
            if (superAdminSnap.exists() && superAdminSnap.data().uid === currentUser.uid) {
              setIsSuperAdmin(true);
              isActualSuperAdmin = true;
            }
          } catch(err) {
            // Permission denied -> either we are not admin OR it doesn't exist yet!
            try {
              await setDoc(superAdminRef, adminData);
              // If successful, we claimed it!
              await setDoc(doc(db, 'users', currentUser.uid), adminData, { merge: true });
              setIsSuperAdmin(true);
              isFirst = true;
              isActualSuperAdmin = true;
            } catch(e) {
              // Someone else is super admin
              setIsSuperAdmin(false);
            }
          }`;

const newLogic = `          // Super Admin Logic
          let isFirst = false;
          let isActualSuperAdmin = currentUser.email === 'emmanuelomojola07@gmail.com';
          
          if (isActualSuperAdmin) {
            setIsSuperAdmin(true);
            const superAdminRef = doc(db, 'system', 'super_admin');
            const adminData = { 
               uid: currentUser.uid, 
               email: currentUser.email || '',
               username: currentUser.displayName?.toLowerCase().replace(/\\s+/g, '') || '',
               displayName: currentUser.displayName || '',
               role: "super_admin",
               isSuperAdmin: true,
               createdAt: new Date().toISOString() 
             };
             
             try {
               await setDoc(superAdminRef, adminData, { merge: true });
             } catch(e) {
               console.warn("Failed to set super_admin ref", e);
             }
          } else {
             setIsSuperAdmin(false);
          }`;

if (code.includes('let isActualSuperAdmin = false;')) {
  code = code.replace(oldLogic, newLogic);
  fs.writeFileSync('src/contexts/AuthContext.tsx', code);
  console.log("Updated AuthContext.tsx");
} else {
  console.log("Could not find the old logic block.");
}
