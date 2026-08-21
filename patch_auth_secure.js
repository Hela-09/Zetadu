import fs from 'fs';

let auth = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

const oldTry = `          // Super Admin Logic
          let isFirst = false;
          let isActualSuperAdmin = false;
          try {
            const superAdminRef = doc(db, 'system', 'super_admin');
            const superAdminSnap = await getDoc(superAdminRef);
            
            if (!superAdminSnap.exists()) {
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
              isFirst = true;
              isActualSuperAdmin = true;
            } else {
              if (superAdminSnap.data().uid === currentUser.uid) {
                setIsSuperAdmin(true);
                isActualSuperAdmin = true;
              } else {
                setIsSuperAdmin(false);
              }
            }
          } catch(err) {
            console.warn("Super admin check failed", err);
          }`;

const newTry = `          // Super Admin Logic
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

auth = auth.replace(oldTry, newTry);
fs.writeFileSync('src/contexts/AuthContext.tsx', auth);
