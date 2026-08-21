const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<main className="flex-1 flex flex-col h-full overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 relative">',
  '<main className={`flex-1 flex flex-col h-full overflow-y-auto relative ${currentView === \'tutor\' ? \'p-0\' : \'p-4 md:p-8 pb-24 md:pb-8\'}`}>'
);

code = code.replace(
  '<header className="flex justify-between items-center mb-6 md:mb-8 shrink-0 gap-4 flex-wrap">',
  '<header className={`flex justify-between items-center shrink-0 gap-4 flex-wrap ${currentView === \'tutor\' ? \'hidden\' : \'mb-6 md:mb-8\'}`}>'
);

fs.writeFileSync('src/App.tsx', code);
