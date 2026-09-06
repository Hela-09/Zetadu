const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/gemini-2\.5-flash/g, 'gemini-3.6-flash');
code = code.replace(/gemini-1\.5-flash/g, 'gemini-3.1-flash-lite');

fs.writeFileSync('server.ts', code);
