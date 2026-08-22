const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 2. Remove theme logic robustly
const lines = code.split('\n');
const newLines = [];
let skip = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes("const theme = settings?.theme || 'system';")) {
    skip = true;
    continue;
  }
  
  if (skip && line.includes("}, [darkMode]);")) {
    skip = false;
    continue;
  }
  
  if (!skip) {
    newLines.push(line);
  }
}

code = newLines.join('\n');

fs.writeFileSync('src/App.tsx', code);
console.log('patched App.tsx again');
