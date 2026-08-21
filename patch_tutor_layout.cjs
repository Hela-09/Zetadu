const fs = require('fs');
let content = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

content = content.replace(
  'h-[100dvh] sm:h-[calc(100dvh-16px)] xl:h-[calc(100dvh-24px)] min-h-[100dvh] sm:min-h-[400px] xl:min-h-[700px]',
  'h-full sm:min-h-[400px] xl:min-h-[700px]'
);

fs.writeFileSync('src/components/Tutor.tsx', content);
console.log('patched tutor layout');
