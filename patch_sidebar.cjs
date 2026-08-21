const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

const importStatement = `import { usePWAInstall } from '../hooks/usePWAInstall';\nimport { Home, BookOpen, MessageSquare, User, Download } from 'lucide-react';`;
code = code.replace(`import { Home, BookOpen, MessageSquare, User } from 'lucide-react';`, importStatement);

const componentStart = `export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {\n  const { isInstallable, triggerInstall } = usePWAInstall();`;
code = code.replace(`export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {`, componentStart);

const targetDiv = `<div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50">`;
const installButton = `
        {isInstallable && (
          <button
            onClick={triggerInstall}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-md mb-4"
          >
            <Download size={18} />
            <span>Install App</span>
          </button>
        )}
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50">`;

code = code.replace(targetDiv, installButton);

fs.writeFileSync('src/components/Sidebar.tsx', code);
console.log('patched sidebar');
