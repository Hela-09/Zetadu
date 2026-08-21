const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const unregisterScript = `    <script>
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          for(let registration of registrations) {
            registration.unregister();
          }
        });
      }
    </script>`;

const registerScript = `    <link rel="manifest" href="/manifest.json" />
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js');
        });
      }
    </script>`;

html = html.replace(unregisterScript, registerScript);
fs.writeFileSync('index.html', html);
console.log('patched index.html');
