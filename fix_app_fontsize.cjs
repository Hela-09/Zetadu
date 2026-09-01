const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldLogic = `  React.useEffect(() => {
    let size = '16px';
    if (settings?.fontSize === 'small') size = '14px';
    if (settings?.fontSize === 'large') size = '18px';
    document.documentElement.style.fontSize = size;
  }, [settings?.fontSize]);`;

const newLogic = `  React.useEffect(() => {
    let size = 'clamp(16px, 1.2vw + 12px, 20px)';
    if (settings?.fontSize === 'small') size = 'clamp(14px, 1vw + 10px, 18px)';
    if (settings?.fontSize === 'large') size = 'clamp(18px, 1.5vw + 14px, 24px)';
    document.documentElement.style.fontSize = size;
  }, [settings?.fontSize]);`;

code = code.replace(oldLogic, newLogic);
fs.writeFileSync('src/App.tsx', code);
console.log("Updated App.tsx font-size logic");
