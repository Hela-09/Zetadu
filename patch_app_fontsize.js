import fs from 'fs';

let app = fs.readFileSync('src/App.tsx', 'utf8');

const oldFontSizeCode = `  const getFontSizeClass = (size: string | undefined) => {
    switch(size) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };`;

const newFontSizeCode = `  React.useEffect(() => {
    let size = '16px';
    if (settings?.fontSize === 'small') size = '14px';
    if (settings?.fontSize === 'large') size = '18px';
    document.documentElement.style.fontSize = size;
  }, [settings?.fontSize]);`;

app = app.replace(oldFontSizeCode, newFontSizeCode);

const rootDivOld = "    <div className={`min-h-[100dvh] font-sans ${darkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'} ${getFontSizeClass(settings?.fontSize)}`}>";
const rootDivNew = "    <div className={`min-h-[100dvh] font-sans ${darkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>";

app = app.replace(rootDivOld, rootDivNew);

fs.writeFileSync('src/App.tsx', app);
