const fs = require('fs');
let content = fs.readFileSync('src/components/BottomNav.tsx', 'utf8');
content = content.replace('pb-safe', 'pb-[env(safe-area-inset-bottom)]');
fs.writeFileSync('src/components/BottomNav.tsx', content);
