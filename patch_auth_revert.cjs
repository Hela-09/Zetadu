const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

code = code.replace(
  '  useEffect(() => {\n    if (!auth) {\n      console.warn("Firebase Auth is not initialized.");\n      setLoading(false);\n      return;\n    }\n    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {',
  '  useEffect(() => {\n    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {'
);

code = code.replace(
  '  const signInWithGoogle = async () => {\n    if (!auth) {\n      setError("Firebase is not configured. Please set your environment variables in Vercel.");\n      return;\n    }\n    setError(null);\n    try {',
  '  const signInWithGoogle = async () => {\n    setError(null);\n    try {'
);

fs.writeFileSync('src/contexts/AuthContext.tsx', code);
