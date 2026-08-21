import fs from 'fs';
let server = fs.readFileSync('server.ts', 'utf8');
server = server.replace(
  '  if (process.env.NODE_ENV !== "production") {',
  `
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: 'API route not found: ' + req.method + ' ' + req.url });
  });

  if (process.env.NODE_ENV !== "production") {`
);
fs.writeFileSync('server.ts', server);
