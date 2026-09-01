const fs = require('fs');
let code = fs.readFileSync('src/components/Practice.tsx', 'utf8');

const navWrapperOld = `<div className="sticky top-28 h-[calc(100dvh-140px)]">`;
const navWrapperNew = `<div className="h-full min-h-0">`;
code = code.replace(navWrapperOld, navWrapperNew);

fs.writeFileSync('src/components/Practice.tsx', code);
console.log('Navigator wrapper patched');
