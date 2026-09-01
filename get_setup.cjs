const fs = require('fs');
const code = fs.readFileSync('src/components/Quiz.tsx', 'utf8');
const start = code.indexOf('if (setupStep === 1) {');
console.log(code.substring(start, start + 800));
