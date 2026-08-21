const fs = require('fs');
let content = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

content = content.replace(
  'focus-within:border-blue-500 transition-all shadow-sm mb-[16px]">',
  'focus-within:border-blue-500 transition-colors shadow-sm mb-[16px]">'
);

fs.writeFileSync('src/components/Tutor.tsx', content);
console.log('patched tutor shake');
