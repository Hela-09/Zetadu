const fs = require('fs');
let content = fs.readFileSync('src/firebase/config.ts', 'utf8');
content = content.replace(
  'const googleProvider = new GoogleAuthProvider();',
  `const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');
googleProvider.addScope('https://www.googleapis.com/auth/drive.metadata.readonly');`
);
fs.writeFileSync('src/firebase/config.ts', content);
console.log('patched firebase config');
