const { createServer } = require('vite');
(async () => {
  const vite = await createServer({
    server: { middlewareMode: true, hmr: { port: 24680 } },
    appType: "spa",
  });
  console.log("Vite started");
  process.exit(0);
})();
