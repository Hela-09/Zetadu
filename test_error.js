import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(
  'app.post("/api/upload",',
  'app.post("/api/error", (req, res, next) => next(new Error("Test error!")));\n  app.post("/api/upload",'
);
fs.writeFileSync('server.ts', content);
