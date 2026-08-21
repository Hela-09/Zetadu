import fs from 'fs';

let content = fs.readFileSync('src/components/Login.tsx', 'utf8');

content = content.replace(
  'className="text-2xl font-bold text-slate-900 mb-2"',
  'className="text-2xl font-bold text-slate-900 dark:text-white mb-2"'
);

content = content.replace(
  'bg-slate-50 flex items-center justify-center p-4',
  'bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4'
);

content = content.replace(
  'bento-card max-w-md w-full items-center text-center py-8',
  'bento-card max-w-md w-full items-center text-center py-8 dark:bg-slate-800 dark:border-slate-700'
);

content = content.replace(
  'className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 text-left w-full max-w-xs"',
  'className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-900/50 text-left w-full max-w-xs"'
);

fs.writeFileSync('src/components/Login.tsx', content);

