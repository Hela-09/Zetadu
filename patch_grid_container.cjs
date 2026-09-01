const fs = require('fs');
let code = fs.readFileSync('src/components/Practice.tsx', 'utf8');

const oldGridCont = `<div className="grid grid-cols-4 lg:grid-cols-5 gap-2 pb-4">`;
const newGridCont = `<div className="grid grid-cols-4 lg:grid-cols-5 gap-2 pb-4 w-full min-w-0 box-border">`;

code = code.replace(oldGridCont, newGridCont);
fs.writeFileSync('src/components/Practice.tsx', code);
console.log('Grid container patched');
