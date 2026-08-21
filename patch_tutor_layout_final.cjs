const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

code = code.replace(
  '<div className="w-full h-full flex items-center justify-center absolute inset-0 bg-white dark:bg-slate-900 sm:bg-slate-100 dark:sm:bg-slate-950">\n      <div className="w-full sm:w-[calc(100%-32px)] lg:w-[calc(100%-48px)] max-w-[1200px] h-full sm:h-[calc(100%-32px)] min-h-[400px] flex gap-0 lg:gap-4 bg-white dark:bg-slate-900 sm:rounded-[18px] lg:rounded-[20px] shadow-none sm:shadow-xl sm:border border-slate-200 dark:border-slate-800 overflow-hidden relative">',
  '<div className="w-full h-full flex items-center justify-center absolute inset-0 bg-white dark:bg-slate-900 sm:bg-slate-100 dark:sm:bg-slate-950">\n      <div className="w-full sm:w-[calc(100%-32px)] lg:w-[calc(100%-48px)] max-w-[1200px] 2xl:max-w-[1280px] h-full sm:h-[calc(100%-32px)] min-h-[400px] flex gap-0 lg:gap-4 bg-white dark:bg-slate-900 sm:rounded-[18px] lg:rounded-[20px] shadow-none sm:shadow-xl sm:border border-slate-200 dark:border-slate-800 overflow-hidden relative">'
);

fs.writeFileSync('src/components/Tutor.tsx', code);
