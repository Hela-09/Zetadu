const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

code = code.replace(
  '<div className="flex-1 flex flex-col h-full min-w-0"',
  '<div className="flex-1 flex flex-col h-full min-w-0 min-h-0"'
);

code = code.replace(
  '<div className="flex-1 bento-card p-0 dark:bg-slate-800 dark:border-slate-700/50 flex flex-col overflow-hidden relative">',
  '<div className="flex-1 bento-card p-0 dark:bg-slate-800 dark:border-slate-700/50 flex flex-col overflow-hidden relative min-h-0">'
);

fs.writeFileSync('src/components/Tutor.tsx', code);
