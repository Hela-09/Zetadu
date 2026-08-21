const fs = require('fs');
let content = fs.readFileSync('src/components/Profile.tsx', 'utf8');

const oldStr = `        {!showLogoutConfirm ? (
                  {deferredPrompt && (
          <button 
            onClick={handleInstallClick}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors w-full justify-center md:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Install EduCore
          </button>
        )}
          <button `;

const newStr = `        {!showLogoutConfirm ? (
          <>
        {deferredPrompt && (
          <button 
            onClick={handleInstallClick}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors w-full justify-center md:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Install EduCore
          </button>
        )}
          <button `;

content = content.replace(oldStr, newStr);

content = content.replace(`            <LogOut size={20} />
            Log Out
          </button>
        ) : (`, `            <LogOut size={20} />
            Log Out
          </button>
          </>
        ) : (`);

fs.writeFileSync('src/components/Profile.tsx', content);
console.log('Fixed Profile.tsx syntax');
