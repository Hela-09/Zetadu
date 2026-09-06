const fs = require('fs');

let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

const searchStr = `          const docSnap = await getDoc(userRef);
          if (!docSnap.exists()) {
            const generatedUsername`;

const replaceStr = `          const docSnap = await getDoc(userRef);
          if (!docSnap.exists()) {
            const isGoogleLogin = currentUser.providerData.some(p => p.providerId === 'google.com');
            if (isGoogleLogin) {
              await firebaseSignOut(auth);
              setError("Access denied: No existing account found. Please sign up first.");
              setUser(null);
              setUserProfile(null);
              setIsSuperAdmin(false);
              setLoading(false);
              return;
            }

            const generatedUsername`;

code = code.replace(searchStr, replaceStr);

fs.writeFileSync('src/contexts/AuthContext.tsx', code);
