const fs = require('fs');
let content = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

// Change overflow-y-auto to overflow-y-scroll for the sidebar conversation list to prevent jumping
content = content.replace(
  'className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0"',
  'className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0 [scrollbar-gutter:stable]"'
);

fs.writeFileSync('src/components/Tutor.tsx', content);
console.log('patched tutor sidebar');
