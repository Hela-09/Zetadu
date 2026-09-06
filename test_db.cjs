const fs = require('fs');
console.log(fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8').includes('disableNetwork'));
