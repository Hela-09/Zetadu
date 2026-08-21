import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

const errHandler = `
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Express Error:", err);
    res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
  });

  app.listen(PORT, "0.0.0.0", () => {
`;

content = content.replace(
  '  app.listen(PORT, "0.0.0.0", () => {',
  errHandler
);

fs.writeFileSync('server.ts', content);

