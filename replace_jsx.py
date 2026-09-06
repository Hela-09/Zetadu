import re

with open('src/components/Home.tsx', 'r') as f:
    content = f.read()

# We need to replace everything from `return (` to the end of the file.
start_idx = content.find('  return (\n    <div className="w-full max-w-7xl')

if start_idx == -1:
    print("Could not find start index")
    exit(1)
    
new_jsx = """  const startRecommendedPractice = () => {
    // Find the weakest topic across all categories
    let target = topicCategories.weak[0] || topicCategories.developing[0] || topicCategories.strong[0];
    if (target) {
      // We don't have subject IDs mapped easily here, but we can set the topic
      localStorage.setItem('zetadu_target_topic', target.name);
      localStorage.setItem('zetadu_target_subject', target.subject);
    }
    setView('practice');
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Hello, {userName}! 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Welcome back to your personalized study dashboard.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Personal Study Coach */}
          <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center">
                <BrainCircuit size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Personal Study Coach</h2>
                <p className="text-slate-500">Analysis based on your practice sessions.</p>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              
              {/* Weak Topics */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                  <Target size={20} className="text-rose-500" /> Focus Areas (Weak)
                </h3>
                {topicCategories.weak.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {topicCategories.weak.map((topic, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate mr-2" title={topic.name}>{topic.name}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{topic.pct}%</span>
                          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic text-sm">No weak areas identified yet. Keep practicing!</p>
                )}
              </div>

              {/* Developing Topics */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                  <Activity size={20} className="text-amber-500" /> Developing
                </h3>
                {topicCategories.developing.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {topicCategories.developing.map((topic, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate mr-2" title={topic.name}>{topic.name}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{topic.pct}%</span>
                          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic text-sm">No developing areas identified yet.</p>
                )}
              </div>

              {/* Strong Topics */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                  <CheckCircle size={20} className="text-emerald-500" /> Strong
                </h3>
                {topicCategories.strong.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {topicCategories.strong.map((topic, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate mr-2" title={topic.name}>{topic.name}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{topic.pct}%</span>
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic text-sm">No strong areas identified yet.</p>
                )}
              </div>

            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
              <button 
                onClick={startRecommendedPractice}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Play size={18} className="fill-current" /> Start Recommended Practice
              </button>
            </div>
            
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button onClick={() => setView('tutor')} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group">
              <div className="w-14 h-14 mb-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare size={28} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base">AI Tutor</h3>
            </button>
            <button onClick={() => setView('subjects')} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group">
              <div className="w-14 h-14 mb-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen size={28} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base">Library</h3>
            </button>
            <button onClick={() => setView('practice')} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group">
              <div className="w-14 h-14 mb-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <PenTool size={28} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base">Practice</h3>
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Continue Study */}
          <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Clock size={18} className="text-blue-500" /> Continue Study
            </h3>
            {recentPractice ? (
              <div onClick={() => setView('practice')} className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 hover:border-blue-300 cursor-pointer transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                    <PenTool size={16} />
                  </div>
                  <span className="font-bold text-sm text-slate-800 dark:text-white">Unfinished Practice</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white truncate">{recentPractice.subject || 'General'}</h4>
                <p className="text-xs text-slate-500 mt-1">Pick up where you left off</p>
              </div>
            ) : (
              <div onClick={() => setView('tutor')} className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 hover:border-emerald-300 cursor-pointer transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
                    <MessageSquare size={16} />
                  </div>
                  <span className="font-bold text-sm text-slate-800 dark:text-white">AI Tutor</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white truncate">Start a new session</h4>
                <p className="text-xs text-slate-500 mt-1">Ask questions or review a topic</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
"""

new_content = content[:start_idx] + new_jsx

with open('src/components/Home.tsx', 'w') as f:
    f.write(new_content)

