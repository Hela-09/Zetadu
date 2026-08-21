const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

code = code.replace(
  '<div className="w-full h-full flex pb-0 sm:pb-4 gap-0 sm:gap-4 absolute inset-0">',
  '<div className="w-full h-full flex gap-0 md:gap-4 absolute inset-0">'
);

fs.writeFileSync('src/components/Tutor.tsx', code);
