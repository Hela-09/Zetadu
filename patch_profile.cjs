const fs = require('fs');
let code = fs.readFileSync('src/components/Profile.tsx', 'utf8');

const themeSection = `            {/* Theme */}
            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 dark:border-slate-700 gap-4">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Theme</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Choose your preferred appearance</p>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
                {(['light', 'dark', 'system'] as const).map(t => (
                  <button 
                    key={t}
                    onClick={() => updateSettings({ theme: t })}
                    className={\`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors \${settings?.theme === t ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}\`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>`;

code = code.replace(themeSection, ``);

code = code.replace(`value="Theme, Font Size, Study Preferences"`, `value="Font Size, Study Preferences"`);

fs.writeFileSync('src/components/Profile.tsx', code);
console.log('patched Profile.tsx');
