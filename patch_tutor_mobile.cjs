const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

code = code.replace(
  '<div className="p-4 md:p-5 md:pb-4 bg-white dark:bg-slate-900 border-t md:border-t-0 border-slate-200 dark:border-slate-800 shrink-0">',
  '<div className="px-4 py-4 md:p-5 md:pb-4 bg-white dark:bg-slate-900 border-t md:border-t-0 border-slate-200 dark:border-slate-800 shrink-0">'
);
code = code.replace(
  'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[20px] p-2 md:p-3 focus-within:ring-2',
  'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[18px] md:rounded-[20px] p-2 md:p-3 focus-within:ring-2'
);

fs.writeFileSync('src/components/Tutor.tsx', code);
