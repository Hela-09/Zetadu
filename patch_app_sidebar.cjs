const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<div className="hidden md:flex relative z-50">',
  '<div className={`hidden md:flex relative z-50 ${currentView === \'tutor\' ? \'!hidden\' : \'\'}`}>'
);

fs.writeFileSync('src/App.tsx', code);
