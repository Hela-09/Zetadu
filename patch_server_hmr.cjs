const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  'server: { middlewareMode: true },',
  'server: { middlewareMode: true, hmr: false },'
);

fs.writeFileSync('server.ts', content);
console.log('patched server.ts with hmr: false');
