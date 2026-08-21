const fs = require('fs');
let content = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

content = content.replace(
  'className="flex-1 w-full bg-transparent border-none py-[12px] px-2 text-[16px] md:text-[17px] leading-[24px] resize-none focus:outline-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-500 self-center"',
  'className="flex-1 min-w-0 w-full bg-transparent border-none py-[12px] px-2 text-[16px] md:text-[17px] leading-[24px] resize-none focus:outline-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-500 self-center"'
);

// Check if search input has min-w-0 issue.
content = content.replace(
  'className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 dark:text-white transition-colors"',
  'className="w-full min-w-0 pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 dark:text-white transition-colors"'
);

fs.writeFileSync('src/components/Tutor.tsx', content);
console.log('patched tutor textareas');
