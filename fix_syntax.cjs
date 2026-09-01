const fs = require('fs');
const path = require('path');
const componentsDir = path.join(__dirname, 'src', 'components');

const files = ['Subjects.tsx', 'Home.tsx'];

files.forEach(f => {
  const p = path.join(componentsDir, f);
  if (fs.existsSync(p)) {
    let code = fs.readFileSync(p, 'utf8');
    code = code.replace(/size=\{clamp\(72, 8vw, 90\)\}/g, 'size={"clamp(72px, 8vw, 90px)"}');
    fs.writeFileSync(p, code);
  }
});
console.log("Fixed syntax");
