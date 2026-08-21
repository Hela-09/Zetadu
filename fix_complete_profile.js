import fs from 'fs';
let cp = fs.readFileSync('src/components/CompleteProfile.tsx', 'utf8');
cp = cp.replace(
  "import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';",
  "import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';"
);
fs.writeFileSync('src/components/CompleteProfile.tsx', cp);
