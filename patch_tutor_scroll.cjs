const fs = require('fs');
let content = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

content = content.replace(
  'className="flex-1 overflow-y-scroll overflow-x-hidden min-h-0"',
  'className="flex-1 overflow-y-auto overflow-x-hidden min-h-0"'
);

fs.writeFileSync('src/components/Tutor.tsx', content);
console.log('patched tutor scroll');
