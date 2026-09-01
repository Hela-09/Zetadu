const fs = require('fs');

let code = fs.readFileSync('src/components/Practice.tsx', 'utf8');

// I will extract everything BEFORE renderQuestionNavigator
const splitPoint = code.indexOf('const renderQuestionNavigator = () =>');
let topCode = code.substring(0, splitPoint);

let remainingCode = code.substring(splitPoint);
// find the end of renderQuestionNavigator. It ends with a semicolon.
const endNavIndex = remainingCode.indexOf('  return (');
let navCode = remainingCode.substring(0, endNavIndex);
let bottomCode = remainingCode.substring(endNavIndex);

// Let's reconstruct navCode
navCode = `  const renderQuestionNavigator = () => (
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
        <div className="grid grid-cols-4 lg:grid-cols-5 gap-2 pb-4 w-full min-w-0 box-border">
          {questions.map((_, i) => {
            const isAnswered = answers[i] !== undefined;
            const isMarked = markedForReview[i];
            const isCurrent = currentQIndex === i;
            
            let btnClass = "w-full h-12 sm:h-14 min-w-0 rounded-lg font-bold text-sm sm:text-base flex items-center justify-center border transition-colors relative shrink-0 ";
            
            if (isCurrent) {
              btnClass += "border-blue-600 ring-2 ring-blue-600/30 text-blue-700 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-900/10 ";
            } else {
              btnClass += "border-slate-200 dark:border-slate-700 ";
            }

            if (isSubmitted) {
              const correct = isOptionCorrect(questions[i], answers[i]);
              if (correct) btnClass += "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400 ";
              else if (!isAnswered) btnClass += "bg-slate-100 text-slate-400 dark:bg-slate-800 ";
              else btnClass += "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-400 ";
            } else {
              if (isAnswered) btnClass += "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 ";
              else btnClass += "bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 ";
            }

            return (
              <button
                key={i}
                onClick={() => {
                  setCurrentQIndex(i);
                  setShowMobileNav(false);
                }}
                className={btnClass}
              >
                {i + 1}
                {isMarked && !isSubmitted && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white dark:border-slate-800"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {!isSubmitted && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex flex-col gap-2 mb-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"></div> Answered: {answeredCount}</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"></div> Unanswered: {unansweredCount}</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-400"></div> Marked: {Object.values(markedForReview).filter(Boolean).length}</div>
          </div>
          <button 
            onClick={() => setShowSubmitPrompt(true)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
          >
            Submit Quiz
          </button>
        </div>
      )}
      {isSubmitted && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="text-center mb-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Final Score</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{score} / {questions.length}</p>
          </div>
          <button 
            onClick={handleExitAfterSubmit}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
          >
            Exit Session
          </button>
        </div>
      )}
    </div>
  );\n\n`;

// Now we need to fix the bottomCode which contains the main component return.
// Since the regex ate from `isSubmitted` to the end of `AnimatePresence`, we need to rebuild the main question area.
// I'll grab bottomCode, find `{/* Desktop Sidebar Navigator */}` and then we just use standard string manipulations.

// Actually, I'll just rewrite the missing part of bottomCode.
// The broken part is from `{!isSubmitted && (` after `</AnimatePresence>` down to `{/* Desktop Sidebar Navigator */}`? No, the broken part is around line 770.

// Let's just restore bottomCode to a known good state by reading what's left.
fs.writeFileSync('src/components/Practice.tsx', topCode + navCode + bottomCode);
