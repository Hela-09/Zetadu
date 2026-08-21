const fs = require('fs');
let content = fs.readFileSync('src/components/Practice.tsx', 'utf8');

// Change grid classes
content = content.replace(
  '<div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-4 xl:grid-cols-5 gap-2">',
  '<div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-4 xl:grid-cols-5 gap-2">'
);

// Change button class
content = content.replace(
  'let btnClass = "w-10 h-10 rounded-lg font-medium text-sm flex items-center justify-center border transition-colors relative ";',
  'let btnClass = "w-full aspect-square rounded-lg font-medium text-sm flex items-center justify-center border transition-colors relative ";'
);

// Change drawer padding so it doesn't double-pad
content = content.replace(
  'className="w-4/5 max-w-sm bg-white dark:bg-slate-900 h-full p-4"',
  'className="w-4/5 max-w-sm bg-white dark:bg-slate-900 h-[100dvh] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)] pl-0 sm:pl-[env(safe-area-inset-left)]"'
);

// Let's also remove border/rounded corners on mobile navigator to maximize space if it's in a drawer.
// Actually, QuestionNavigator is shared between sidebar and mobile drawer. It has `bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 h-full flex flex-col`.
// In a drawer, the rounded corners and border are fine, but maybe we should make it full height. 

fs.writeFileSync('src/components/Practice.tsx', content);
console.log('patched practice nav');
