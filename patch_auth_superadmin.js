import fs from 'fs';

let auth = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

auth = auth.replace(
  '  loading: boolean;',
  '  isSuperAdmin: boolean;\n  loading: boolean;'
);

auth = auth.replace(
  '  const [userProfile, setUserProfile] = useState<any | null>(null);',
  '  const [userProfile, setUserProfile] = useState<any | null>(null);\n  const [isSuperAdmin, setIsSuperAdmin] = useState(false);'
);

const superAdminCheck = `
          // Super Admin Logic
          try {
            const superAdminRef = doc(db, 'system', 'super_admin');
            const superAdminSnap = await getDoc(superAdminRef);
            
            if (!superAdminSnap.exists()) {
              // Create super admin document
              await setDoc(superAdminRef, { uid: currentUser.uid, createdAt: new Date().toISOString() });
              setIsSuperAdmin(true);
            } else {
              if (superAdminSnap.data().uid === currentUser.uid) {
                setIsSuperAdmin(true);
              } else {
                setIsSuperAdmin(false);
              }
            }
          } catch(err) {
            console.warn("Super admin check failed", err);
          }
`;

auth = auth.replace(
  '          const userRef = doc(db, \'users\', currentUser.uid);\n          const docSnap = await getDoc(userRef);',
  '          const userRef = doc(db, \'users\', currentUser.uid);\n          const docSnap = await getDoc(userRef);\n' + superAdminCheck
);

auth = auth.replace(
  '    <AuthContext.Provider value={{ user, userProfile, refreshProfile, settings, updateSettings, loading, error, signInWithGoogle, signInWithGithub, signOut, getToken, clearError, setError }}>',
  '    <AuthContext.Provider value={{ user, userProfile, refreshProfile, settings, updateSettings, isSuperAdmin, loading, error, signInWithGoogle, signInWithGithub, signOut, getToken, clearError, setError }}>'
);

fs.writeFileSync('src/contexts/AuthContext.tsx', auth);
