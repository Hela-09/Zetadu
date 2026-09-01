const fs = require('fs');
let code = fs.readFileSync('src/components/Practice.tsx', 'utf8');
const endNavIndex = code.indexOf('  return (\n    <div className="w-full h-full');
console.log(code.substring(endNavIndex, endNavIndex + 1500));
