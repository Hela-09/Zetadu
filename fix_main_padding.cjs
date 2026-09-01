const fs = require('fs');

let file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /p-4 md:p-8 pb-24 md:pb-8 pb-\[calc\(6rem\+env\(safe-area-inset-bottom\)\)\]/g,
  'p-4 md:p-8 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-8'
);

fs.writeFileSync(file, code);

console.log("Fixed main padding classes");
