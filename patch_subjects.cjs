const fs = require('fs');
let code = fs.readFileSync('src/components/Subjects.tsx', 'utf8');

// 1. Fix scrollbar-hide
code = code.replace(/scrollbar-hide/g, 'no-scrollbar');

// 2. Redesign the selectedSubject block
const oldSelected = `if (selectedSubject) {
    return (
      <div className="w-full max-w-5xl mx-auto pb-8 flex flex-col">
        <div className="mb-8 shrink-0">
          <button onClick={() => setSelectedSubject(null)} className="text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 mb-4 transition-colors">
            <ChevronLeft size={16} /> Back to Subjects
          </button>
          <div className="flex items-center gap-4">
            <div className={\`p-5 rounded-2xl text-white shadow-lg \${selectedSubject.color}\`}>
              <BookOpen size={40} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{selectedSubject.name}</h2>
                <button 
                  onClick={(e) => toggleFavorite(e, selectedSubject.id)}
                  className={\`p-2 rounded-full transition-colors \${favorites.includes(selectedSubject.id) ? 'text-amber-400 bg-amber-50 dark:bg-amber-400/10' : 'text-slate-400 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800'}\`}
                >
                  <Star size={24} className={favorites.includes(selectedSubject.id) ? 'fill-current' : ''} />
                </button>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-lg">{selectedSubject.category}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center pt-4 md:pt-8">
           <div className="w-full max-w-2xl grid gap-4 grid-cols-1 md:grid-cols-2">
             <button 
               onClick={() => handleAction('practice')}
               className="group p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-xl transition-all flex flex-col items-start gap-4 text-left"
             >
               <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                 <Play size={32} className="fill-current" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Start Practice</h3>
                 <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Begin a custom practice session or exam simulation for {selectedSubject.name}.</p>
               </div>
             </button>

             <button 
               onClick={() => handleAction('tutor')}
               className="group p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all flex flex-col items-start gap-4 text-left"
             >
               <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                 <MessageSquare size={32} />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Study with AI Tutor</h3>
                 <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Get personalized explanations and step-by-step guidance.</p>
               </div>
             </button>
           </div>
        </div>
      </div>
    );
  }`;

const newSelected = `if (selectedSubject) {
    return (
      <div className="w-full max-w-5xl mx-auto pb-8 flex flex-col">
        <button onClick={() => setSelectedSubject(null)} className="text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 mb-6 transition-colors w-fit">
          <ChevronLeft size={16} /> Back to Library
        </button>
        
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden mb-10">
          <div className={\`absolute top-0 left-0 w-full h-2 \${selectedSubject.color}\`}></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 md:gap-6">
              <div className={\`p-4 md:p-6 rounded-2xl text-white shadow-lg \${selectedSubject.color} shrink-0\`}>
                <BookOpen size={48} className="w-10 h-10 md:w-12 md:h-12" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg text-xs md:text-sm font-bold tracking-wide uppercase">
                    {selectedSubject.category}
                  </span>
                </div>
                <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                  {selectedSubject.name}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Mastery:
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 md:w-48 bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={\`h-2.5 rounded-full \${selectedSubject.color} transition-all duration-1000\`} 
                        style={{ width: \`\${progressData[selectedSubject.id] || 0}%\` }}
                      ></div>
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{progressData[selectedSubject.id] || 0}%</span>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={(e) => toggleFavorite(e, selectedSubject.id)}
              className={\`p-3 md:p-4 rounded-xl md:rounded-full transition-colors shrink-0 flex items-center justify-center gap-2 font-bold \${favorites.includes(selectedSubject.id) ? 'text-amber-600 bg-amber-50 border-2 border-amber-200 dark:text-amber-400 dark:bg-amber-900/30 dark:border-amber-800/50' : 'text-slate-500 hover:text-amber-500 bg-white hover:bg-slate-50 border-2 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600'}\`}
            >
              <Star size={20} className={favorites.includes(selectedSubject.id) ? 'fill-current' : ''} />
              <span className="inline md:hidden lg:inline">{favorites.includes(selectedSubject.id) ? 'Favorited' : 'Add to Favorites'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
           <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Choose Activity</h3>
        </div>
        
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
          <button 
            onClick={() => handleAction('practice')}
            className="group p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-xl transition-all flex flex-col items-start gap-4 md:gap-6 text-left relative overflow-hidden"
          >
            <div className="absolute -right-8 -bottom-8 text-slate-50 dark:text-slate-700/20 group-hover:text-blue-50 dark:group-hover:text-blue-900/10 transition-colors pointer-events-none transform group-hover:scale-110 duration-500">
              <Play size={180} className="fill-current" />
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform relative z-10">
              <Play size={32} className="fill-current" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3">Start Practice</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">Engage in adaptive quiz sessions, simulate real exams, and test your knowledge interactively.</p>
            </div>
          </button>

          <button 
            onClick={() => handleAction('tutor')}
            className="group p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all flex flex-col items-start gap-4 md:gap-6 text-left relative overflow-hidden"
          >
            <div className="absolute -right-8 -bottom-8 text-slate-50 dark:text-slate-700/20 group-hover:text-emerald-50 dark:group-hover:text-emerald-900/10 transition-colors pointer-events-none transform group-hover:scale-110 duration-500">
              <MessageSquare size={180} className="fill-current" />
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform relative z-10">
              <MessageSquare size={32} className="fill-current" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3">Study with AI Tutor</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">Get personalized step-by-step explanations, ask questions, and learn at your own pace.</p>
            </div>
          </button>
        </div>
      </div>
    );
  }`;

if (code.includes(oldSelected.trim().substring(0, 50))) {
    // try exact match or close match by doing a substring replacement based on 'if (selectedSubject) {' to 'return ('
    const regex = /if \(selectedSubject\) \{[\s\S]*?    \);\n  \}/;
    code = code.replace(regex, newSelected);
    fs.writeFileSync('src/components/Subjects.tsx', code);
    console.log("Successfully replaced selectedSubject block!");
} else {
    console.log("Could not find the block to replace.");
}

