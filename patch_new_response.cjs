const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

code = code.replace(
  'className="absolute bottom-[140px] left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md rounded-full px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors z-10 flex items-center gap-2"',
  'className="absolute bottom-[140px] md:bottom-[170px] left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-full px-5 py-2 h-[48px] min-w-[150px] justify-center text-[15px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors z-10 flex items-center gap-2"'
);
fs.writeFileSync('src/components/Tutor.tsx', code);
