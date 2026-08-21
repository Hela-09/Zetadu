const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const script = `
    <script>
      const originalError = console.error;
      console.error = function(...args) {
        if (typeof args[0] === 'string' && args[0].includes('[vite]')) return;
        originalError.apply(console, args);
      };
    </script>
`;

if (!content.includes('originalError')) {
  content = content.replace('</head>', script + '</head>');
  fs.writeFileSync('index.html', content);
  console.log('patched index.html to suppress [vite] errors');
}
