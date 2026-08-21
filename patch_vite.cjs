const fs = require('fs');
let content = fs.readFileSync('vite.config.ts', 'utf8');

const replacement = `
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          navigateFallbackDenylist: [/^\/api/],
          runtimeCaching: [
`;

content = content.replace(`
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          runtimeCaching: [
`, replacement);

fs.writeFileSync('vite.config.ts', content);
console.log('patched vite config');
