const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

code = code.replace(
  '<div className="mx-auto max-w-[900px] w-full px-4 sm:px-6 py-6 space-y-7 pb-32 md:pb-40">',
  '<div className="mx-auto max-w-[950px] w-full px-4 sm:px-6 py-6 space-y-7 pb-32 md:pb-40">'
);
fs.writeFileSync('src/components/Tutor.tsx', code);
