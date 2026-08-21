const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(/educore-66491/g, 'hale-generator-95g21');
fs.writeFileSync('server.ts', code);
