const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Replace invalid models
code = code.replace(/gemini-3\.6-flash/g, 'gemini-2.5-flash');
code = code.replace(/gemini-3\.1-flash-lite/g, 'gemini-1.5-flash');

fs.writeFileSync('server.ts', code);
