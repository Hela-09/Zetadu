const fs = require('fs');
let code = fs.readFileSync('src/components/Quiz.tsx', 'utf8');

const replacement = `
      return (
        <div className="w-full max-w-7xl mx-auto pb-12 flex flex-col">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
            <div className="flex items-center gap-4">
              {onBack && (
                <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors self-start mt-2">
                  <ArrowLeft size={24} />
                </button>
              )}
              <div>
                <p className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-2">
                  Practice Session
                </p>
                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Select a Subject</h2>
              </div>
            </div>`;

code = code.replace(`      return (
        <div className="w-full max-w-7xl mx-auto pb-12 flex flex-col">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
            <div>
              <p className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-2">
                Practice Session
              </p>
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Select a Subject</h2>
            </div>`, replacement);
fs.writeFileSync('src/components/Quiz.tsx', code);
