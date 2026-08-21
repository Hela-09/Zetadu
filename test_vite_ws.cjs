const { createServer } = require('vite');
(async () => {
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "spa",
  });
  console.log("Vite started");
  process.exit(0);
})();
