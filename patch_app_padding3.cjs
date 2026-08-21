const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<main className={`flex-1 flex flex-col h-full overflow-y-auto relative ${currentView === \'tutor\' ? \'p-0\' : \'p-4 md:p-8 pb-24 md:pb-8\'}`}>',
  '<main className={`flex-1 flex flex-col h-full overflow-y-auto relative ${currentView === \'tutor\' ? \'p-0 md:p-4 pb-20 md:pb-4\' : \'p-4 md:p-8 pb-24 md:pb-8\'}`}>'
);

fs.writeFileSync('src/App.tsx', code);
