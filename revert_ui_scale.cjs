const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');
const appFile = path.join(__dirname, 'src', 'App.tsx');

const files = fs.readdirSync(componentsDir)
  .filter(f => f.endsWith('.tsx'))
  .map(f => path.join(componentsDir, f));
files.push(appFile);

let modifications = 0;

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  let originalCode = code;

  // 1. Text classes
  code = code.replace(/text-\[clamp\(14px,1\.5vw,16px\)\]/g, 'text-xs');
  code = code.replace(/text-\[clamp\(15px,1\.8vw,18px\)\]/g, 'text-sm');
  code = code.replace(/text-\[clamp\(17px,2vw,20px\)\]/g, 'text-base');
  code = code.replace(/text-\[clamp\(19px,2\.2vw,24px\)\]/g, 'text-lg');
  code = code.replace(/text-\[clamp\(22px,2\.5vw,28px\)\]/g, 'text-xl');
  code = code.replace(/text-\[clamp\(26px,3vw,32px\)\]/g, 'text-2xl');
  code = code.replace(/text-\[clamp\(28px,4vw,36px\)\]/g, 'text-3xl');
  code = code.replace(/text-\[clamp\(32px,5vw,42px\)\]/g, 'text-4xl');
  
  // 2. Heights
  code = code.replace(/min-h-\[clamp\(44px,5vh,48px\)\] h-auto py-3\.5/g, 'h-12');
  code = code.replace(/min-h-\[clamp\(44px,5vh,48px\)\] h-auto py-3/g, 'h-10');
  code = code.replace(/min-h-\[clamp\(48px,5\.5vh,56px\)\] h-auto py-3\.5/g, 'h-12');
  code = code.replace(/min-h-\[clamp\(56px,6vh,64px\)\] h-auto py-4/g, 'h-14');
  
  // 3. Grid Columns
  code = code.replace(/grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4/g, 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3');
  
  // 4. Card Paddings
  code = code.replace(/p-\[clamp\(24px,3vw,32px\)\]/g, 'p-6');
  code = code.replace(/p-\[clamp\(28px,3\.5vw,36px\)\]/g, 'p-8');
  code = code.replace(/p-\[clamp\(20px,2\.5vw,28px\)\]/g, 'p-5');
  code = code.replace(/p-\[clamp\(16px,2vw,24px\)\]/g, 'p-4');

  // 5. Gaps
  code = code.replace(/gap-\[clamp\(16px,2vw,24px\)\]/g, 'gap-4');
  code = code.replace(/gap-\[clamp\(24px,3vw,32px\)\]/g, 'gap-6');
  code = code.replace(/gap-\[clamp\(32px,4vw,40px\)\]/g, 'gap-8');
  
  // 6. Min height block
  code = code.replace(/text-left bg-white min-h-\[clamp\(280px,30vh,320px\)\] flex flex-col justify-between/g, 'text-left bg-white');

  // 7. Icon size in Subjects.tsx / Home.tsx
  code = code.replace(/size=\{72\}/g, 'size={28}');

  if (code !== originalCode) {
    fs.writeFileSync(file, code);
    modifications++;
  }
});

console.log(`Modified ${modifications} files.`);

// Restore App.tsx font logic
const appTsxPath = path.join(__dirname, 'src', 'App.tsx');
let appCode = fs.readFileSync(appTsxPath, 'utf8');

const newLogic = `  React.useEffect(() => {
    let size = 'clamp(16px, 1.2vw + 12px, 20px)';
    if (settings?.fontSize === 'small') size = 'clamp(14px, 1vw + 10px, 18px)';
    if (settings?.fontSize === 'large') size = 'clamp(18px, 1.5vw + 14px, 24px)';
    document.documentElement.style.fontSize = size;
  }, [settings?.fontSize]);`;

const oldLogic = `  React.useEffect(() => {
    let size = '16px';
    if (settings?.fontSize === 'small') size = '14px';
    if (settings?.fontSize === 'large') size = '18px';
    document.documentElement.style.fontSize = size;
  }, [settings?.fontSize]);`;

appCode = appCode.replace(newLogic, oldLogic);
fs.writeFileSync(appTsxPath, appCode);
console.log("Restored App.tsx font logic.");
