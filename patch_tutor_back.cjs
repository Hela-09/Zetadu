const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

const oldButton = `{setCurrentView && (
            <button 
              onClick={() => setCurrentView('home')}
              className="flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium text-sm"
              title="Back to Home"
            >
              <ArrowLeft size={20} />
              <span className="hidden md:inline">Back</span>
            </button>
          )}`;

const newButton = `{setCurrentView && (
            <button 
              onClick={() => {
                const prev = localStorage.getItem('educore_previous_view');
                if (prev && prev !== 'tutor') {
                  setCurrentView(prev);
                } else {
                  setCurrentView('home');
                }
              }}
              className="flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium text-sm"
              title="Back"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
              <span className="hidden md:inline">Back</span>
            </button>
          )}`;

if (code.includes(oldButton)) {
    code = code.replace(oldButton, newButton);
    fs.writeFileSync('src/components/Tutor.tsx', code);
    console.log('patched back button in Tutor.tsx');
} else {
    console.log('could not find old button in Tutor.tsx');
}
