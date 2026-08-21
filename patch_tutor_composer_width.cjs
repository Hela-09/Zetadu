const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

code = code.replace(
  '<div className="relative flex flex-col sm:flex-row items-end gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[20px] p-[20px] min-h-[100px] sm:min-h-[110px] md:min-h-[120px] focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all shadow-sm">',
  '<div className="relative w-full flex flex-col sm:flex-row items-end gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[20px] p-[20px] min-h-[100px] sm:min-h-[110px] md:min-h-[120px] focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all shadow-sm">'
);

fs.writeFileSync('src/components/Tutor.tsx', code);
