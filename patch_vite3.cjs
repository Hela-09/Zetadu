const fs = require('fs');
let content = fs.readFileSync('vite.config.ts', 'utf8');
content = content.replace('devOptions: {\n          enabled: true\n        }', 'devOptions: {\n          enabled: false\n        }');
fs.writeFileSync('vite.config.ts', content);
console.log('patched devOptions');
