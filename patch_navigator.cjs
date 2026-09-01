const fs = require('fs');
let code = fs.readFileSync('src/components/Practice.tsx', 'utf8');

const navOld = `  const renderQuestionNavigator = () => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-900 dark:text-white">Questions</h3>
        {showMobileNav && (
          <button onClick={() => setShowMobileNav(false)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <X size={20} />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto pr-1 min-h-0">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {questions.map((_, i) => {
            const isAnswered = answers[i] !== undefined;
            const isMarked = markedForReview[i];
            const isCurrent = currentQIndex === i;
            
            let btnClass = "w-full aspect-square rounded-lg font-medium text-sm flex items-center justify-center border transition-colors relative ";
            
            if (isCurrent) {
              btnClass += "border-blue-600 ring-2 ring-blue-600/30 ";
            } else {
              btnClass += "border-slate-200 dark:border-slate-700 ";
            }`;

const navNew = `  const renderQuestionNavigator = () => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h3 className="font-bold text-slate-900 dark:text-white">Questions</h3>
        {showMobileNav && (
          <button onClick={() => setShowMobileNav(false)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <X size={20} />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto pr-1 min-h-0">
        <div className="grid grid-cols-4 lg:grid-cols-5 gap-2 pb-4">
          {questions.map((_, i) => {
            const isAnswered = answers[i] !== undefined;
            const isMarked = markedForReview[i];
            const isCurrent = currentQIndex === i;
            
            let btnClass = "w-full h-12 sm:h-14 min-w-0 rounded-lg font-bold text-sm sm:text-base flex items-center justify-center border transition-colors relative shrink-0 ";
            
            if (isCurrent) {
              btnClass += "border-blue-600 ring-2 ring-blue-600/30 text-blue-700 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-900/10 ";
            } else {
              btnClass += "border-slate-200 dark:border-slate-700 ";
            }`;

code = code.replace(navOld, navNew);
fs.writeFileSync('src/components/Practice.tsx', code);
console.log('Navigator grid patched');
