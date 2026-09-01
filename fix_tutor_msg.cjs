const fs = require('fs');

let file = 'src/components/Tutor.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /w-full max-w-\[900px\] min-w-0 \$\{msg\.role === 'tutor' \? 'flex-1' : ''\}/g,
  "max-w-[calc(100%-48px)] sm:max-w-[85%] md:max-w-[900px] min-w-0 ${msg.role === 'tutor' ? 'flex-1' : ''}"
);

fs.writeFileSync(file, code);

console.log("Fixed Tutor message sizing");
