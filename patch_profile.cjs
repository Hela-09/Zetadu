const fs = require('fs');

let code = fs.readFileSync('src/components/Profile.tsx', 'utf8');

// I will insert XP and Level into the profile header
const oldHeader = `<div className="text-center md:text-left flex-1 relative z-10">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{userProfile?.name || user?.displayName || 'Student'}</h2>
          <p className="text-slate-500 mb-1">@{userProfile?.username}</p>
          <p className="text-xs text-slate-400 mb-4">{user?.email}</p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5"><Clock size={16} /> Member since {memberSince}</div>
            <div className="flex items-center gap-1.5"><MapPin size={16} /> International</div>
            <div className="flex items-center gap-1.5"><GraduationCap size={16} /> Secondary</div>
          </div>
        </div>`;

const newHeader = `<div className="text-center md:text-left flex-1 relative z-10 w-full">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{userProfile?.name || user?.displayName || 'Student'}</h2>
              <p className="text-slate-500 mb-1">@{userProfile?.username || 'student'}</p>
              <p className="text-xs text-slate-400 mb-4">{user?.email}</p>
            </div>
            
            <div className="flex items-center justify-center gap-3">
              <div className="flex flex-col items-center bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 rounded-xl px-4 py-2">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Level</span>
                <span className="text-xl font-black text-blue-700 dark:text-blue-400">{userProfile?.level || 1}</span>
              </div>
              <div className="flex flex-col items-center bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 rounded-xl px-4 py-2">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">XP</span>
                <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">{userProfile?.xp || 0}</span>
              </div>
              <div className="flex flex-col items-center bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-800/50 rounded-xl px-4 py-2">
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Streak</span>
                <span className="text-xl font-black text-orange-700 dark:text-orange-400">{userProfile?.streak || 0}🔥</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-600 dark:text-slate-400 mt-4 md:mt-0">
            <div className="flex items-center gap-1.5"><Clock size={16} /> Member since {memberSince}</div>
            <div className="flex items-center gap-1.5"><MapPin size={16} /> International</div>
            <div className="flex items-center gap-1.5"><GraduationCap size={16} /> Secondary</div>
          </div>
        </div>`;

code = code.replace(oldHeader, newHeader);

// Now I will add an ActionRow for Achievements right after the "History & Content" title
const oldActionRow = `<SectionHeading>History & Content</SectionHeading>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
          <ActionRow icon={Activity} title="Detailed Statistics" value="View progress" onClick={() => handleAction('stats')} />`;

const newActionRow = `<SectionHeading>History & Content</SectionHeading>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
          <ActionRow icon={Award} title="Achievements" value="Badges & Milestones" onClick={() => handleAction('achievements')} />
          <ActionRow icon={Activity} title="Detailed Statistics" value="View progress" onClick={() => handleAction('stats')} />`;

if(code.includes('<SectionHeading>History & Content</SectionHeading>')) {
   code = code.replace(oldActionRow, newActionRow);
}

// Add the achievements tab handler
// First, add the component definition somewhere
const achievementsComponent = `
  const AchievementsView = () => {
    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setActiveSection(null)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Achievements</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900/50 rounded-2xl shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-10"><Award size={64} className="text-amber-500"/></div>
             <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-2xl relative z-10 shrink-0">🏆</div>
             <div className="relative z-10">
               <h4 className="font-bold text-slate-900 dark:text-white text-lg">First Practice</h4>
               <p className="text-sm text-slate-500">Completed your first quiz session</p>
               <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-1 block">Unlocked</span>
             </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-900/50 rounded-2xl shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-10"><Flame size={64} className="text-orange-500"/></div>
             <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-2xl relative z-10 shrink-0">🔥</div>
             <div className="relative z-10">
               <h4 className="font-bold text-slate-900 dark:text-white text-lg">7-Day Streak</h4>
               <p className="text-sm text-slate-500">Studied for 7 consecutive days</p>
               <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-1 block">Unlocked</span>
             </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-900/50 rounded-2xl shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-10"><BrainCircuit size={64} className="text-blue-500"/></div>
             <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-2xl relative z-10 shrink-0">🧠</div>
             <div className="relative z-10">
               <h4 className="font-bold text-slate-900 dark:text-white text-lg">Master Mind</h4>
               <p className="text-sm text-slate-500">Scored 90%+ in 3 practice sessions</p>
               <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mt-2">
                 <div className="h-full bg-blue-500 rounded-full w-2/3"></div>
               </div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 block">2 / 3 Completed</span>
             </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm relative overflow-hidden opacity-60 grayscale hover:grayscale-0 transition-all cursor-not-allowed">
             <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl relative z-10 shrink-0">⚡</div>
             <div className="relative z-10">
               <h4 className="font-bold text-slate-900 dark:text-white text-lg">Daily Challenger</h4>
               <p className="text-sm text-slate-500">Complete 10 Daily Challenges</p>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 block">Locked</span>
             </div>
          </div>
        </div>
      </div>
    );
  };
`;

code = code.replace("const StatsView = () => {", achievementsComponent + "\n\n  const StatsView = () => {");

code = code.replace("{activeSection === 'stats' && <StatsView />}", "{activeSection === 'stats' && <StatsView />}\n      {activeSection === 'achievements' && <AchievementsView />}");
code = code.replace("import {  User, Award,", "import {  User, Award, Flame,");

fs.writeFileSync('src/components/Profile.tsx', code);

