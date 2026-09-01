const fs = require('fs');

let file = 'src/components/Practice.tsx';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(/min-h-\[100dvh\]/g, ''); // Let it grow naturally
fs.writeFileSync(file, code);

console.log("Removed min-h-[100dvh] from Practice");
