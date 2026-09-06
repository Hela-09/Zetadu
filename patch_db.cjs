const fs = require('fs');
let fb = fs.readFileSync('src/lib/firebase.ts', 'utf8');

fb = fb.replace(
  '// Use the default database for the new project\n    db = getFirestore(app);',
  '// Use the named database\n    db = getFirestore(app, "ai-studio-zetadu-c6308d9c-0c0e-4c1f-8911-aa88c989aa89");'
);

fs.writeFileSync('src/lib/firebase.ts', fb);
