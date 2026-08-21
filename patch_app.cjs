const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace("import ReloadPrompt from './components/ReloadPrompt';", "");
content = content.replace("<ReloadPrompt />", "");

fs.writeFileSync('src/App.tsx', content);
console.log('patched App.tsx');
