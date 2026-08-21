const fs = require('fs');
let code = fs.readFileSync('src/components/Login.tsx', 'utf8');

if (!code.includes("import { isSignInWithEmailLink } from 'firebase/auth';")) {
  code = code.replace(
    "import { BookOpen, Loader2, Mail } from 'lucide-react';",
    "import { BookOpen, Loader2, Mail } from 'lucide-react';\nimport { isSignInWithEmailLink } from 'firebase/auth';\nimport { auth } from '../firebase/config';"
  );
}

fs.writeFileSync('src/components/Login.tsx', code);
