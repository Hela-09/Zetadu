const fs = require('fs');
let code = fs.readFileSync('src/components/Profile.tsx', 'utf8');

const importAdd = `import { Flame, Trophy, Target, CheckCircle } from 'lucide-react';\n`;

if (!code.includes('Trophy')) {
    code = code.replace("Award,", "Award, Trophy, Target, Flame, CheckCircle,");
}

const target = `<SectionHeading>My Learning & Content</SectionHeading>`;

const newContent = `
      {/* Achievements Section */}
      {userProfile?.achievements && userProfile.achievements.length > 0 && (
         <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 px-2">Recent Achievements</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userProfile.achievements.map((ach: any) => {
                 let Icon = Trophy;
                 if (ach.icon === 'Flame') Icon = Flame;
                 if (ach.icon === 'Target') Icon = Target;
                 if (ach.icon === 'CheckCircle') Icon = CheckCircle;
                 
                 return (
                   <div key={ach.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-yellow-100 dark:border-yellow-900/30 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400 opacity-5 rounded-bl-[100px]"></div>
                     <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center mb-3">
                        <Icon size={24} />
                     </div>
                     <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-1">{ach.title}</h4>
                     <p className="text-[10px] text-slate-500">{ach.description}</p>
                   </div>
                 );
              })}
            </div>
         </div>
      )}

      <SectionHeading>My Learning & Content</SectionHeading>`;

code = code.replace(target, newContent);
fs.writeFileSync('src/components/Profile.tsx', code);
