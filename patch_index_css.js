import fs from 'fs';

let content = fs.readFileSync('src/index.css', 'utf8');

content = content.replace(
  '@apply bg-white border border-slate-200 rounded-[20px] p-4 sm:p-6 shadow-sm flex flex-col;',
  '@apply bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-[20px] p-4 sm:p-6 shadow-sm flex flex-col;'
);

fs.writeFileSync('src/index.css', content);

