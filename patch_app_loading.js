import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'className="min-h-screen bg-slate-50 flex items-center justify-center"',
  'className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center"'
);

fs.writeFileSync('src/App.tsx', content);

