const fs = require('fs');
let code = fs.readFileSync('src/firebase/config.ts', 'utf8');

code = code.replace("googleProvider.addScope('https://www.googleapis.com/auth/drive.file');\n", "");
code = code.replace("googleProvider.addScope('https://www.googleapis.com/auth/drive.metadata.readonly');\n", "");

fs.writeFileSync('src/firebase/config.ts', code);
console.log("Scopes removed!");
