const fs = require('fs');
let content = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

// Add oauthToken to interface
content = content.replace(
  '  getToken: () => Promise<string | null>;',
  '  getToken: () => Promise<string | null>;\n  oauthToken: string | null;'
);

// Add oauthToken to state
content = content.replace(
  'const [error, setError] = useState<string | null>(null);',
  'const [error, setError] = useState<string | null>(null);\n  const [oauthToken, setOauthToken] = useState<string | null>(null);'
);

// Add getRedirectResult
content = content.replace(
  'import { User, signInWithPopup, signInWithRedirect, signOut as firebaseSignOut, onAuthStateChanged, getIdToken } from \'firebase/auth\';',
  'import { User, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut as firebaseSignOut, onAuthStateChanged, getIdToken } from \'firebase/auth\';'
);

// Handle redirect result and capture token
content = content.replace(
  '  useEffect(() => {\n    const handleStorage',
  `  useEffect(() => {
    if (auth) {
      getRedirectResult(auth).then(result => {
        if (result) {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential?.accessToken) {
            setOauthToken(credential.accessToken);
          }
        }
      }).catch(err => {
        console.error("Redirect sign-in error", err);
      });
    }
    const handleStorage`
);

// Clear token on logout
content = content.replace(
  'localStorage.removeItem(\'educore_current_view\');\n      await firebaseSignOut(auth);',
  'localStorage.removeItem(\'educore_current_view\');\n      setOauthToken(null);\n      await firebaseSignOut(auth);'
);

// Capture token on popup
content = content.replace(
  'await signInWithPopup(auth, googleProvider);',
  `const result = await signInWithPopup(auth, googleProvider);
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential?.accessToken) {
            setOauthToken(credential.accessToken);
          }`
);

// Export oauthToken in provider
content = content.replace(
  '<AuthContext.Provider value={{ user, userProfile, refreshProfile, settings, updateSettings, isSuperAdmin, loading, error, signInWithGoogle, signOut, getToken, clearError, setError }}>',
  '<AuthContext.Provider value={{ user, userProfile, refreshProfile, settings, updateSettings, isSuperAdmin, loading, error, signInWithGoogle, signOut, getToken, clearError, setError, oauthToken }}>'
);

fs.writeFileSync('src/contexts/AuthContext.tsx', content);
console.log('patched AuthContext');
