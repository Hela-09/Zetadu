import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');

const replacement = `
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Express Error:", err);
    res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(\`Server running on http://localhost:\${PORT}\`);
  });
}

startServer();
`;

const lines = content.split('\\n');
const idx = lines.findIndex(l => l.includes('if (process.env.NODE_ENV !== "production") {'));
if (idx !== -1) {
  content = lines.slice(0, idx).join('\\n') + replacement;
}

fs.writeFileSync('server.ts', content);
