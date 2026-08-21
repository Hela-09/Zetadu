const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const script = `
    <script>
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          for(let registration of registrations) {
            registration.unregister();
          }
        });
      }
    </script>
`;

if (!content.includes('unregister')) {
  content = content.replace('</head>', script + '</head>');
  fs.writeFileSync('index.html', content);
  console.log('patched index.html to unregister SW');
}
