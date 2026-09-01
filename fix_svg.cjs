const fs = require('fs');
const path = require('path');
const componentsDir = path.join(__dirname, 'src', 'components');
const files = ['Subjects.tsx', 'Home.tsx'];

files.forEach(f => {
  const p = path.join(componentsDir, f);
  if (fs.existsSync(p)) {
    let code = fs.readFileSync(p, 'utf8');
    code = code.replace(/size=\{"clamp\(.*?\)""\}/g, 'size={72}');
    code = code.replace(/size=\{"clamp\(.*?\)"\}/g, 'size={72}');
    code = code.replace(/size=\{clamp\(.*?\)\}/g, 'size={72}');
    fs.writeFileSync(p, code);
  }
});
console.log("Fixed SVG size syntax");
