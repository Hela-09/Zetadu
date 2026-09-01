const fs = require('fs');
let code = fs.readFileSync('src/components/Subjects.tsx', 'utf8');

const oldBack = `<button onClick={() => setSelectedSubject(null)} className="text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 mb-6 transition-colors w-fit">
          <ChevronLeft size={16} /> Back to Library
        </button>`;

const newBack = `<button onClick={() => setSelectedSubject(null)} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 mb-6 transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 w-fit shadow-sm hover:shadow-md">
          <ChevronLeft size={16} /> Back to Library
        </button>`;

code = code.replace(oldBack, newBack);
fs.writeFileSync('src/components/Subjects.tsx', code);
console.log('Back button patched');
