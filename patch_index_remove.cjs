const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const scriptToRemove = `<script>
      (function() {
        try {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          function updateTheme(e) {
            if (e.matches) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
          updateTheme(mediaQuery);
          mediaQuery.addEventListener('change', updateTheme);
        } catch (e) {}
      })();
    </script>`;

if(html.includes(scriptToRemove)) {
    html = html.replace(scriptToRemove, '');
    fs.writeFileSync('index.html', html);
    console.log('Removed script');
} else {
    console.log('Script not found');
}
