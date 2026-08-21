const fs = require('fs');
let content = fs.readFileSync('src/components/Tutor.tsx', 'utf8');
const search = 'h-[100dvh] sm:h-[calc(100dvh-16px)] xl:h-[calc(100dvh-24px)] min-h-[100dvh] sm:min-h-[400px] xl:min-h-[700px]';
console.log(content.includes(search));
