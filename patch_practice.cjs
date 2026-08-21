const fs = require('fs');
const content = fs.readFileSync('src/components/Practice.tsx', 'utf8');

const target = `    return (
      <div className="w-full max-w-2xl mx-auto pb-8">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold tracking-wide text-blue-600 dark:text-blue-400 uppercase mb-1">
            Setup Quiz
          </p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">EduCore Practice Session</h2>
        </div>
        
        <form onSubmit={handleGenerate} className="bento-card dark:bg-slate-800 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Education Level</label>
              <select value={level} onChange={(e) => {
                setLevel(e.target.value);
                if (e.target.value === 'Primary') setSelectedClass('Primary 6');
                else if (e.target.value === 'Secondary') setSelectedClass('SSS 3');
                else setSelectedClass('100 Level');
              }} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                <option>Primary</option>
                <option>Secondary</option>
                <option>University</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Class / Exam</label>
              {level === 'Primary' && (
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                  {SUBJECT_DATA.Primary.classes.map(c => <option key={c}>{c}</option>)}
                </select>
              )}
              {level === 'Secondary' && (
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                  {SUBJECT_DATA.Secondary.classes.map(c => <option key={c}>{c}</option>)}
                </select>
              )}
              {level === 'University' && (
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                  {SUBJECT_DATA.University.classes.map(c => <option key={c}>{c}</option>)}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</label>
              {level === 'University' ? (
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Search subjects... (e.g. Computer Science)" required className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
              ) : (
                <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                  {availableSubjects.map(s => <option key={s}>{s}</option>)}
                </select>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Topic (Optional)</label>
              <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Algebra, Cellular Respiration" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
                <option>Mixed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Number of Questions</label>
              <select value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={40}>40</option>
                <option value={50}>50</option>
                <option value={60}>60</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Timer</label>
              <select value={timerDuration} onChange={(e) => setTimerDuration(Number(e.target.value))} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                <option value={10}>10 minutes</option>
                <option value={20}>20 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
              </select>
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <Settings size={20} />}
            {loading ? 'Generating...' : 'Start Practice'}
          </button>
        </form>
      </div>
    );`;

const replacement = `    if (setupStep === 1) {
      const filtered = ALL_SUBJECTS.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return (
        <div className="w-full max-w-7xl mx-auto pb-12 flex flex-col h-full">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
            <div>
              <p className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-2">
                Practice Session
              </p>
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Select a Subject</h2>
            </div>
            
            <div className="relative w-full md:w-96">
              <input 
                type="text" 
                placeholder="Search subjects..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
              />
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1 overflow-y-auto pb-8 pr-2">
            {filtered.map((sub) => (
              <button
                key={sub.id}
                onClick={() => {
                  setSubjectId(sub.id);
                  setSubject(sub.name);
                  setSetupStep(2);
                }}
                className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-slate-100 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-slate-500 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between text-left relative"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className={\`p-4 rounded-2xl text-white shadow-md \${sub.color} group-hover:scale-110 transition-transform duration-300\`}>
                      <BookOpen size={28} />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 pr-6">
                    {sub.name}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{sub.category}</p>
                </div>
              </button>
            ))}
            
            {filtered.length === 0 && (
              <div className="col-span-full py-20 text-center flex flex-col items-center">
                 <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                   <Search size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No subjects found</h3>
                 <p className="text-slate-500 dark:text-slate-400">Try adjusting your search.</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-2xl mx-auto pb-8">
        <div className="mb-8 flex items-center justify-between">
          <button onClick={() => setSetupStep(1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="text-center flex-1 mr-10">
            <p className="text-sm font-semibold tracking-wide text-blue-600 dark:text-blue-400 uppercase mb-1">
              Setup Quiz
            </p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">EduCore Practice Session</h2>
          </div>
        </div>
        
        <form onSubmit={handleGenerate} className="bento-card dark:bg-slate-800 p-6 space-y-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl mb-2 flex items-center gap-3">
            <BookOpen size={24} className="text-blue-500" />
            <div>
               <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-0.5">Selected Subject</p>
               <p className="text-lg font-bold text-slate-900 dark:text-white">{subject}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Education Level</label>
              <select value={level} onChange={(e) => {
                setLevel(e.target.value);
                if (e.target.value === 'Primary') setSelectedClass('Primary 6');
                else if (e.target.value === 'Secondary') setSelectedClass('SSS 3');
                else setSelectedClass('100 Level');
              }} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                <option>Primary</option>
                <option>Secondary</option>
                <option>University</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Class / Exam</label>
              {level === 'Primary' && (
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                  {SUBJECT_DATA.Primary.classes.map(c => <option key={c}>{c}</option>)}
                </select>
              )}
              {level === 'Secondary' && (
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                  {SUBJECT_DATA.Secondary.classes.map(c => <option key={c}>{c}</option>)}
                </select>
              )}
              {level === 'University' && (
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                  {SUBJECT_DATA.University.classes.map(c => <option key={c}>{c}</option>)}
                </select>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Topic (Optional)</label>
              <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Algebra, Cellular Respiration" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
                <option>Mixed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Number of Questions</label>
              <select value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={40}>40</option>
                <option value={50}>50</option>
                <option value={60}>60</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Timer</label>
              <select value={timerDuration} onChange={(e) => setTimerDuration(Number(e.target.value))} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                <option value={10}>10 minutes</option>
                <option value={20}>20 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
              </select>
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <Settings size={20} />}
            {loading ? 'Generating...' : 'Start Practice'}
          </button>
        </form>
      </div>
    );`;

if (content.includes(target)) {
    fs.writeFileSync('src/components/Practice.tsx', content.replace(target, replacement));
    console.log("Success");
} else {
    console.log("Target string not found in Practice.tsx");
}
