const fs = require('fs');

let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

// We need to move setUser(currentUser) and setLoading(false) to the very end of onAuthStateChanged
// Let's replace the whole onAuthStateChanged block to be safe.

const newBlock = `
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // Clear listeners if user signs out or changes
      if (profileUnsubRef.current) profileUnsubRef.current();
      if (settingsUnsubRef.current) settingsUnsubRef.current();
      
      if (currentUser) {
        try {
          if (!db) throw new Error("Firestore is not initialized.");
          const userRef = doc(db, 'users', currentUser.uid);
          
          let isActualSuperAdmin = currentUser.email === 'emmanuelomojola07@gmail.com';
          setIsSuperAdmin(isActualSuperAdmin);

          // Bootstrap documents if missing
          const docSnap = await getDoc(userRef);
          if (!docSnap.exists()) {
            const generatedUsername = currentUser.email ? currentUser.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') + Math.floor(Math.random() * 1000) : 'user_' + currentUser.uid.substring(0, 6);
            const newUserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              name: currentUser.displayName || '',
              username: generatedUsername,
              photoURL: currentUser.photoURL || '',
              educationLevel: 'Secondary',
              country: 'International',
              progress: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              role: isActualSuperAdmin ? 'super_admin' : 'student',
              isSuperAdmin: isActualSuperAdmin
            };
            await setDoc(userRef, newUserProfile, { merge: true });
            setUserProfile(newUserProfile);
          } else {
             const data = docSnap.data();
             if (isActualSuperAdmin && !data.isSuperAdmin) {
               await setDoc(userRef, { role: 'super_admin', isSuperAdmin: true }, { merge: true });
             }
             setUserProfile(data);
          }
          
          const settingsSnap = await getDoc(doc(db, 'settings', currentUser.uid));
          if (!settingsSnap.exists()) {
              await setDoc(doc(db, 'settings', currentUser.uid), { ...defaultSettings, uid: currentUser.uid });
          } else {
              setSettings({ ...defaultSettings, ...settingsSnap.data() } as UserSettings);
          }

          await setDoc(doc(db, 'user_progress', currentUser.uid), { uid: currentUser.uid }, { merge: true });
          await setDoc(doc(db, 'bookmarks', currentUser.uid), { uid: currentUser.uid }, { merge: true });
          await setDoc(doc(db, 'notes', currentUser.uid), { uid: currentUser.uid }, { merge: true });

          // Establish Real-Time Listeners
          profileUnsubRef.current = onSnapshot(userRef, (snapshot) => {
             if (snapshot.exists()) {
                 let data = snapshot.data();
                 if (data.subscriptionStatus === 'active' && data.subscriptionExpires) {
                    if (Date.now() > data.subscriptionExpires) {
                        data.subscriptionStatus = 'expired';
                        setDoc(userRef, { subscriptionStatus: 'expired' }, { merge: true });
                    }
                 }
                 setUserProfile(data);
             }
          });
          
          settingsUnsubRef.current = onSnapshot(doc(db, 'settings', currentUser.uid), (snapshot) => {
              if (snapshot.exists()) {
                  setSettings({ ...defaultSettings, ...snapshot.data() } as UserSettings);
              }
          });

        } catch (err) {
          console.warn("Error setting up user profile:", err);
        }
      } else {
        setUserProfile(null);
        setSettings(defaultSettings);
        setIsSuperAdmin(false);
      }
      
      setUser(currentUser);
      setLoading(false);
    });
`;

// Find the start and end of onAuthStateChanged block
const startIdx = code.indexOf('const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {');
const endStr = '    return () => {';
const endIdx = code.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
   code = code.substring(0, startIdx) + newBlock.trim() + '\n\n' + code.substring(endIdx);
}

// Clean up signOut
const signOutStart = code.indexOf('const signOut = async () => {');
const signOutEndStr = '  const getToken = async () => {';
const signOutEnd = code.indexOf(signOutEndStr);

if (signOutStart !== -1 && signOutEnd !== -1) {
  const newSignOut = `const signOut = async () => {
    if (!auth) return;
    try {
      localStorage.removeItem("practice_session");
      localStorage.removeItem("tutor_session");
      localStorage.removeItem("zetadu_current_view");
      
      await firebaseSignOut(auth);
    } catch (error) {
      console.warn("Error signing out", error);
    }
  };

  `;
  code = code.substring(0, signOutStart) + newSignOut + code.substring(signOutEnd);
}

fs.writeFileSync('src/contexts/AuthContext.tsx', code);
