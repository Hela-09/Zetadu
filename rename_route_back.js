import fs from 'fs';
let server = fs.readFileSync('server.ts', 'utf8');
server = server.replace('app.post("/api/upload-files",', 'app.post("/api/upload",');
fs.writeFileSync('server.ts', server);

let tutor = fs.readFileSync('src/components/Tutor.tsx', 'utf8');
tutor = tutor.replace("fetch('/api/upload-files',", "fetch('/api/upload',");
fs.writeFileSync('src/components/Tutor.tsx', tutor);
