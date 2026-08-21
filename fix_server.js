import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace('startServer();', '}\n\nstartServer();');
fs.writeFileSync('server.ts', content);
