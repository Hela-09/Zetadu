const fs = require('fs');
let content = fs.readFileSync('src/components/Tutor.tsx', 'utf8');
content = content.replace(/100vw/g, '100%');
fs.writeFileSync('src/components/Tutor.tsx', content);
