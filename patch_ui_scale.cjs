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

  // 1. Scale standard text classes up
  // Replace text-xs -> text-[clamp(14px,1.5vw,16px)]
  code = code.replace(/\btext-xs\b/g, 'text-[clamp(14px,1.5vw,16px)]');
  // Replace text-sm -> text-[clamp(15px,1.8vw,18px)]
  code = code.replace(/\btext-sm\b/g, 'text-[clamp(15px,1.8vw,18px)]');
  // Replace text-base -> text-[clamp(17px,2vw,20px)]
  code = code.replace(/\btext-base\b/g, 'text-[clamp(17px,2vw,20px)]');
  // Replace text-lg -> text-[clamp(19px,2.2vw,24px)]
  code = code.replace(/\btext-lg\b/g, 'text-[clamp(19px,2.2vw,24px)]');
  // Replace text-xl -> text-[clamp(22px,2.5vw,28px)]
  code = code.replace(/\btext-xl\b/g, 'text-[clamp(22px,2.5vw,28px)]');
  // Replace text-2xl -> text-[clamp(26px,3vw,32px)]
  code = code.replace(/\btext-2xl\b/g, 'text-[clamp(26px,3vw,32px)]');
  // Replace text-3xl/4xl -> text-[clamp(28px,4vw,36px)]
  code = code.replace(/\btext-3xl\b/g, 'text-[clamp(28px,4vw,36px)]');
  code = code.replace(/\btext-4xl\b/g, 'text-[clamp(32px,5vw,42px)]');
  
  // 2. Scale up buttons and inputs (heights)
  // Find h-10, h-12, h-14, replace with clamped min-heights
  code = code.replace(/\bh-10\b/g, 'min-h-[clamp(44px,5vh,48px)] h-auto py-3');
  code = code.replace(/\bh-12\b/g, 'min-h-[clamp(48px,5.5vh,56px)] h-auto py-3.5');
  code = code.replace(/\bh-14\b/g, 'min-h-[clamp(56px,6vh,64px)] h-auto py-4');
  
  // 3. Grid Columns (4 cards on desktop, 2-3 on tablet)
  code = code.replace(/grid-cols-1 md:grid-cols-2 lg:grid-cols-3/g, 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4');
  code = code.replace(/grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4/g, 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4');
  
  // 4. Card Paddings (28-36px)
  // A typical subject card has p-6 or p-8
  code = code.replace(/\bp-6\b/g, 'p-[clamp(24px,3vw,32px)]');
  code = code.replace(/\bp-8\b/g, 'p-[clamp(28px,3.5vw,36px)]');
  code = code.replace(/\bp-5\b/g, 'p-[clamp(20px,2.5vw,28px)]');
  code = code.replace(/\bp-4\b/g, 'p-[clamp(16px,2vw,24px)]');

  // 5. General Gap Scaling
  code = code.replace(/\bgap-4\b/g, 'gap-[clamp(16px,2vw,24px)]');
  code = code.replace(/\bgap-6\b/g, 'gap-[clamp(24px,3vw,32px)]');
  code = code.replace(/\bgap-8\b/g, 'gap-[clamp(32px,4vw,40px)]');
  
  // 6. Icon Scaling (72-90px for subject cards)
  // In Subjects.tsx, the icon is typically inside a div.
  // We'll scale up any generic Lucide icon sizes if they are smaller.
  // We'll replace size={24} with size={32}, size={28} with size={72} in Subjects.tsx
  if (file.includes('Subjects.tsx') || file.includes('Home.tsx')) {
    code = code.replace(/size=\{28\}/g, 'size={clamp(72, 8vw, 90)}'); 
    // wait, size prop on lucide react doesn't accept css strings natively without causing SVG warnings, 
    // it expects a number or string like "72px", but let's use the className for scaling.
    // Actually, Lucide React accepts size={"100%"} if we control it with a wrapper, or we can just pass size={72}.
    code = code.replace(/<BookOpen size=\{28\}/g, '<BookOpen size={72}');
    code = code.replace(/<BookOpen size=\{24\}/g, '<BookOpen size={72}');
  }

  // 7. Subject card min-height
  // Cards use aspect-square or min-h. Let's enforce min-height on anything that looks like a card.
  // Replace rounded-2xl border ... with min-height classes.
  // In Subjects.tsx, we can inject min-h-[clamp(280px,30vh,320px)] into the card button.
  if (file.includes('Subjects.tsx')) {
    code = code.replace(/className="(.*?)text-left bg-white(.*?)"/g, 'className="$1text-left bg-white min-h-[clamp(280px,30vh,320px)] flex flex-col justify-between$2"');
  }

  if (code !== originalCode) {
    fs.writeFileSync(file, code);
    modifications++;
  }
});

console.log(`Modified ${modifications} files.`);
