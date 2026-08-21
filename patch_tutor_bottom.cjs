const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

code = code.replace(
  '<div className="px-4 py-4 md:p-5 md:pb-4 bg-white dark:bg-slate-900 border-t md:border-t-0 border-slate-200 dark:border-slate-800 shrink-0">',
  '<div className="px-4 py-4 md:px-6 md:py-4 bg-white dark:bg-slate-900 border-t md:border-t-0 border-slate-200 dark:border-slate-800 shrink-0">'
);
fs.writeFileSync('src/components/Tutor.tsx', code);
