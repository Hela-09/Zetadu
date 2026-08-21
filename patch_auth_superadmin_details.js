import fs from 'fs';

let auth = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

const oldCheck = `            if (!superAdminSnap.exists()) {
              // Create super admin document
              await setDoc(superAdminRef, { uid: currentUser.uid, createdAt: new Date().toISOString() });
              setIsSuperAdmin(true);
            }`;

const newCheck = `            if (!superAdminSnap.exists()) {
              // Create super admin document
              const adminData = { 
                uid: currentUser.uid, 
                email: currentUser.email || '',
                username: currentUser.displayName?.toLowerCase().replace(/\\s+/g, '') || '',
                displayName: currentUser.displayName || '',
                role: "super_admin",
                isSuperAdmin: true,
                createdAt: new Date().toISOString() 
              };
              await setDoc(superAdminRef, adminData);
              // Also update the user's profile doc
              await setDoc(doc(db, 'users', currentUser.uid), adminData, { merge: true });
              setIsSuperAdmin(true);
            }`;

auth = auth.replace(oldCheck, newCheck);

// Let's also update the newUserProfile to merge if superAdmin already set things
const oldUserProfile = `          if (!docSnap.exists()) {
            const newUserProfile = {
              uid: currentUser.uid,
              name: currentUser.displayName || '',
              email: currentUser.email || '',
              educationLevel: 'Secondary', // Default
              country: 'International', // Default
              progress: 0,
              createdAt: new Date().toISOString()
            };
            await setDoc(userRef, newUserProfile);
            setUserProfile(newUserProfile);
          } else {
            setUserProfile(docSnap.data());
          }`;

const newUserProfileStr = `          if (!docSnap.exists()) {
            const isFirst = !superAdminSnap.exists();
            const newUserProfile = {
              uid: currentUser.uid,
              name: currentUser.displayName || '',
              email: currentUser.email || '',
              educationLevel: 'Secondary', // Default
              country: 'International', // Default
              progress: 0,
              createdAt: new Date().toISOString(),
              ...(isFirst ? { role: 'super_admin', isSuperAdmin: true } : { role: 'student', isSuperAdmin: false })
            };
            await setDoc(userRef, newUserProfile, { merge: true });
            setUserProfile(newUserProfile);
          } else {
            const data = docSnap.data();
            if (superAdminSnap.exists() && superAdminSnap.data().uid === currentUser.uid && !data.isSuperAdmin) {
               await setDoc(userRef, { role: 'super_admin', isSuperAdmin: true }, { merge: true });
               data.role = 'super_admin';
               data.isSuperAdmin = true;
            }
            setUserProfile(data);
          }`;

auth = auth.replace(oldUserProfile, newUserProfileStr);
fs.writeFileSync('src/contexts/AuthContext.tsx', auth);
