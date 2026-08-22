const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

const profileCheck = `            setUserProfile(data);
          }

          // Ensure other documents exist with merge to prevent overwriting`;

const newProfileCheck = `            // Check if subscription expired
            let updatedData = { ...data };
            if (data.subscriptionStatus === 'active' && data.subscriptionExpires) {
              if (Date.now() > data.subscriptionExpires) {
                updatedData.subscriptionStatus = 'expired';
                await setDoc(userRef, { subscriptionStatus: 'expired' }, { merge: true });
              }
            }
            setUserProfile(updatedData);
          }

          // Ensure other documents exist with merge to prevent overwriting`;

if (code.includes(profileCheck)) {
  code = code.replace(profileCheck, newProfileCheck);
  fs.writeFileSync('src/contexts/AuthContext.tsx', code);
  console.log("AuthContext.tsx profile logic patched.");
}

const refreshLogic = `    if (user && db) {
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      }
    }`;

const newRefreshLogic = `    if (user && db) {
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) {
        let data = docSnap.data();
        if (data.subscriptionStatus === 'active' && data.subscriptionExpires) {
          if (Date.now() > data.subscriptionExpires) {
            data.subscriptionStatus = 'expired';
            await setDoc(doc(db, 'users', user.uid), { subscriptionStatus: 'expired' }, { merge: true });
          }
        }
        setUserProfile(data);
      }
    }`;

if (code.includes(refreshLogic)) {
  code = code.replace(refreshLogic, newRefreshLogic);
  fs.writeFileSync('src/contexts/AuthContext.tsx', code);
  console.log("AuthContext.tsx refresh logic patched.");
}
