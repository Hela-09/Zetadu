const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const script = `
    <script>
      window.addEventListener('error', function(e) {
        if (e.message && e.message.includes('[vite]')) {
          e.preventDefault();
          e.stopPropagation();
        }
      }, true);
      window.addEventListener('unhandledrejection', function(e) {
        if (e.reason && e.reason.message && e.reason.message.includes('[vite]')) {
          e.preventDefault();
          e.stopPropagation();
        }
      }, true);
    </script>
`;

if (!content.includes('unhandledrejection')) {
  content = content.replace('</head>', script + '</head>');
  fs.writeFileSync('index.html', content);
  console.log('patched index.html with window error listeners');
}
