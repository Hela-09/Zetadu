const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(/hale-generator-95g21.firebasestorage.app/g, 'educore-66491.firebasestorage.app');

fs.writeFileSync('server.ts', content);
console.log('patched server.ts again');
