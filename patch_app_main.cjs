const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /className=\{`flex-1 flex flex-col h-\[100dvh\] md:h-full relative/g,
  'className={`flex-1 flex flex-col min-h-0 relative'
);

fs.writeFileSync('src/App.tsx', content);
console.log('patched app main');
