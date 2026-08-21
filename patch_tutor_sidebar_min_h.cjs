const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

code = code.replace(
  '<div className="flex-1 overflow-y-auto p-3 space-y-2">',
  '<div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">'
);

fs.writeFileSync('src/components/Tutor.tsx', code);
