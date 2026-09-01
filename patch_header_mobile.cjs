const fs = require('fs');
let code = fs.readFileSync('src/components/Practice.tsx', 'utf8');

const current = `<div className="flex-1 h-1.5 sm:h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shrink-0 hidden sm:block">`;
const current2 = `<span className="text-[10px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 tabular-nums w-[3ch] shrink-0 text-right hidden sm:block">`;

code = code.replace(current, `<div className="flex-1 h-1.5 sm:h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shrink-0">`);
code = code.replace(current2, `<span className="text-[10px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 tabular-nums min-w-[3ch] shrink-0 text-right">`);

fs.writeFileSync('src/components/Practice.tsx', code);
