const fs = require('fs');
let content = fs.readFileSync('src/components/Practice.tsx', 'utf8');
content = content.replace(/100vh/g, '100dvh');
fs.writeFileSync('src/components/Practice.tsx', content);
