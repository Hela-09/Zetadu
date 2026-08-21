import fs from 'fs';
let server = fs.readFileSync('server.ts', 'utf8');
server = server.replace('app.post("/api/upload",', 'app.post("/api/upload-files",');
fs.writeFileSync('server.ts', server);

let tutor = fs.readFileSync('src/components/Tutor.tsx', 'utf8');
tutor = tutor.replace("fetch('/api/upload',", "fetch('/api/upload-files',");
fs.writeFileSync('src/components/Tutor.tsx', tutor);
