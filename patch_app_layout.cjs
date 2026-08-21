const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '<div className="flex-1 relative flex flex-col">',
  '<div className="flex-1 relative flex flex-col min-h-0">'
);

fs.writeFileSync('src/App.tsx', content);
console.log('patched app layout');
