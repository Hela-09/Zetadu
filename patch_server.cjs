const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(/let projectId = process.env.VITE_FIREBASE_PROJECT_ID \|\| "hale-generator-95g21";/g, 'let projectId = process.env.VITE_FIREBASE_PROJECT_ID || "educore-66491";');

fs.writeFileSync('server.ts', content);
console.log('patched server.ts');
