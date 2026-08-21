const fs = require('fs');
let content = fs.readFileSync('vite.config.ts', 'utf8');
content = content.replace(
  "includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-192x192.svg'],",
  "includeAssets: ['pwa-192x192.svg', 'pwa-512x512.svg'],"
);
fs.writeFileSync('vite.config.ts', content);
console.log('patched includeAssets');
