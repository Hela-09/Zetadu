const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

code = code.replace(`import { usePWAInstall } from '../hooks/usePWAInstall';`, `import { usePWAInstall } from '../hooks/usePWAInstall';\nimport Logo from './Logo';`);

const oldLogo = `<div className="w-10 h-10 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M4 8 H22 L14 20 H4 L12 8 Z" fill="#f8fafc" />
            <path d="M28 24 H10 L18 12 H28 L20 24 Z" fill="#06b6d4" />
          </svg>
        </div>`;

code = code.replace(oldLogo, `<Logo />`);
fs.writeFileSync('src/components/Sidebar.tsx', code);
console.log('patched sidebar with generic Logo');
