const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');
code = code.replace(/export type ViewType = 'home' \| 'subjects' \| 'practice' \| 'tutor' \| 'profile' \| 'admin';/, "export type ViewType = 'home' | 'subjects' | 'practice' | 'tutor' | 'profile' | 'admin' | 'opportunities';");
fs.writeFileSync('src/types.ts', code);
console.log('Patched types');
