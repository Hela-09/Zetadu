const fs = require('fs');
let content = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

content = content.replace(
  '<div className="bg-white dark:bg-slate-900 shrink-0 flex flex-col items-center w-full">',
  '<div className="bg-white dark:bg-slate-900 shrink-0 flex flex-col items-center w-full pb-[env(safe-area-inset-bottom)]">'
);

fs.writeFileSync('src/components/Tutor.tsx', content);
