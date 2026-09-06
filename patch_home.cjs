const fs = require('fs');
let code = fs.readFileSync('src/components/Home.tsx', 'utf8');

const importAdd = `import { getLevelInfo } from '../lib/achievements';\n`;

if (!code.includes('../lib/achievements')) {
   code = code.replace("import { useAuth } from '../contexts/AuthContext';", "import { useAuth } from '../contexts/AuthContext';\nimport { getLevelInfo } from '../lib/achievements';");
}

const headerOld = `      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Hello, {userName}! 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Welcome back to your personalized study dashboard.
          </p>
        </div>
      </div>`;

const headerNew = `      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Hello, {userName}! 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Welcome back to your personalized study dashboard.
          </p>
        </div>
        
        {/* Phase 4: Level & XP Stats */}
        {(() => {
           const xp = userProfile?.xp || 0;
           const levelInfo = getLevelInfo(xp);
           const prevLevelXp = levelInfo.level === 1 ? 0 : getLevelInfo(xp - (xp % 100 === 0 ? 1 : xp % 100) - 100).nextXp || 0; // Simplified
           const currentLevelBaseXp = levelInfo.level === 1 ? 0 : 
               (levelInfo.level === 2 ? 100 : 
               (levelInfo.level === 3 ? 250 : 
               (levelInfo.level === 4 ? 500 : 
               (levelInfo.level === 5 ? 1000 : 
               (levelInfo.level === 6 ? 2500 : 5000)))));
           
           const progressPct = levelInfo.level >= 7 ? 100 : Math.min(100, Math.max(0, ((xp - currentLevelBaseXp) / (levelInfo.nextXp - currentLevelBaseXp)) * 100));
           
           return (
             <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold shadow-md">
                   Lvl {levelInfo.level}
                </div>
                <div className="pr-2">
                   <div className="flex items-center justify-between gap-4 mb-1">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{levelInfo.title}</span>
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{xp} / {levelInfo.nextXp} XP</span>
                   </div>
                   <div className="h-2 w-32 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: \`\${progressPct}%\` }}></div>
                   </div>
                </div>
             </div>
           );
        })()}
      </div>`;

code = code.replace(headerOld, headerNew);

fs.writeFileSync('src/components/Home.tsx', code);
