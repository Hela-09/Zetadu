const fs = require('fs');
const glob = require('glob');

glob.sync('src/**/*.tsx').forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/min-h-screen/g, 'min-h-[100dvh]');
  fs.writeFileSync(file, content);
});
console.log('patched h-screen');
