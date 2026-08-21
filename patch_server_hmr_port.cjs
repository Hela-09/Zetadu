const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  'server: { middlewareMode: true, hmr: false },',
  'server: { middlewareMode: true, hmr: { port: 24680 } },'
);

fs.writeFileSync('server.ts', content);
console.log('patched server.ts with hmr port 24680');
