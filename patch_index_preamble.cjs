const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const script = `
    <script type="module">
      window.__vite_plugin_react_preamble_installed__ = true;
    </script>
`;

if (!content.includes('__vite_plugin_react_preamble_installed__')) {
  content = content.replace('</head>', script + '</head>');
  fs.writeFileSync('index.html', content);
  console.log('patched index.html with preamble flag');
}
