const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<header className={`flex justify-between items-center shrink-0 gap-4 flex-wrap ${currentView === \'tutor\' ? \'hidden\' : \'mb-6 md:mb-8\'}`}>',
  '<header className={`flex justify-between items-center shrink-0 gap-4 flex-wrap ${currentView === \'tutor\' ? \'p-4 md:px-6 md:py-4 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10\' : \'mb-6 md:mb-8\'}`}>'
);

fs.writeFileSync('src/App.tsx', code);
