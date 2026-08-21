import fs from 'fs';

let content = fs.readFileSync('index.html', 'utf8');

const script = `
    <script>
      try {
        const localTheme = localStorage.getItem('educore_theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (localTheme === 'dark' || (!localTheme && systemDark) || (localTheme === 'system' && systemDark)) {
          document.documentElement.classList.add('dark');
        }
      } catch (e) {}
    </script>
  </head>
`;

content = content.replace('  </head>', script);

fs.writeFileSync('index.html', content);

