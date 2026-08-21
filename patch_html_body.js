import fs from 'fs';

let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(
  '<body>',
  '<body class="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">'
);

fs.writeFileSync('index.html', content);

