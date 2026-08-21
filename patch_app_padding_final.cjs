const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<main className={`flex-1 flex flex-col h-full overflow-hidden relative ${currentView === \'tutor\' ? \'p-0\' : \'p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto\'}`}>',
  '<main className={`flex-1 flex flex-col h-full overflow-hidden relative ${currentView === \'tutor\' ? \'p-0 pb-[80px] md:pb-0\' : \'p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto\'}`}>'
);

// We need to keep the global header visible on mobile/desktop if they need the theme toggle, 
// BUT the user specifically asked for a specific header structure and dimensions for Tutor.
// The user says "Header height: 72px ... The header should NOT take excessive vertical space." 
// I will keep the global header hidden for tutor, and I'll add the Theme Toggle into Tutor's header!
fs.writeFileSync('src/App.tsx', code);
