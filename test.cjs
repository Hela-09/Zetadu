const fs = require('fs');
const code = fs.readFileSync('src/components/Practice.tsx', 'utf8');
console.log(code.substring(code.indexOf('if (setupStep === 1) {'), code.indexOf('return (', code.indexOf('if (setupStep === 1) {') + 50) + 1500));
