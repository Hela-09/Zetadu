const fs = require('fs');
let code = fs.readFileSync('src/components/Practice.tsx', 'utf8');

const oldExplanation = `{isSubmitted && (
                <div className={\`p-6 rounded-2xl border-2 mb-8 \${
                  answers[currentQIndex] === undefined
                    ? 'bg-slate-50 border-slate-200 dark:bg-slate-900/50 dark:border-slate-800'
                    : isOptionCorrect(question, answers[currentQIndex]) 
                      ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800/30' 
                      : 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800/30'
                }\`}>
                  <div className="flex gap-4">
                    <AlertCircle className={\`shrink-0 mt-1 \${
                      answers[currentQIndex] === undefined
                        ? 'text-slate-500 dark:text-slate-400'
                        : isOptionCorrect(question, answers[currentQIndex]) ? 'text-emerald-500' : 'text-amber-500'
                    }\`} size={24} />
                    <div>
                      <h4 className={\`text-lg font-bold mb-2 \${
                        answers[currentQIndex] === undefined
                          ? 'text-slate-700 dark:text-slate-300'
                          : isOptionCorrect(question, answers[currentQIndex]) ? 'text-emerald-800 dark:text-emerald-300' : 'text-amber-800 dark:text-amber-300'
                      }\`}>
                        {answers[currentQIndex] === undefined 
                          ? 'Not Answered' 
                          : isOptionCorrect(question, answers[currentQIndex]) ? 'Correct!' : 'Incorrect'}
                      </h4>
                      <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed [overflow-wrap:anywhere] break-normal min-w-0" dangerouslySetInnerHTML={{ __html: question.explanation || 'No explanation provided.' }} />
                    </div>
                  </div>
                </div>
              )}`;

const newExplanation = `{isSubmitted && (
                <div className={\`p-6 rounded-3xl border-2 mb-8 shadow-sm \${
                  answers[currentQIndex] === undefined
                    ? 'bg-slate-50 border-slate-200 dark:bg-slate-900/50 dark:border-slate-800'
                    : isOptionCorrect(question, answers[currentQIndex]) 
                      ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800/30' 
                      : 'bg-rose-50 border-rose-200 dark:bg-rose-900/10 dark:border-rose-800/30'
                }\`}>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 border-b border-slate-200/50 dark:border-slate-700/50 pb-4">
                      {answers[currentQIndex] === undefined ? (
                         <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                           <AlertCircle size={24} />
                         </div>
                      ) : isOptionCorrect(question, answers[currentQIndex]) ? (
                         <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                           <CheckCircle2 size={24} />
                         </div>
                      ) : (
                         <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600">
                           <XCircle size={24} />
                         </div>
                      )}
                      <div>
                        <h4 className={\`text-xl font-bold \${
                          answers[currentQIndex] === undefined
                            ? 'text-slate-700 dark:text-slate-300'
                            : isOptionCorrect(question, answers[currentQIndex]) ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'
                        }\`}>
                          {answers[currentQIndex] === undefined 
                            ? 'Not Answered' 
                            : isOptionCorrect(question, answers[currentQIndex]) ? '✓ Correct' : '✕ Incorrect'}
                        </h4>
                        {!isOptionCorrect(question, answers[currentQIndex]) && answers[currentQIndex] !== undefined && (
                           <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                             The correct answer was: <span className="font-bold text-slate-900 dark:text-white">{question.options[getNormalizedCorrectIndex(question)]}</span>
                           </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-3">
                         <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                           <BrainCircuit size={16} />
                         </div>
                         <h5 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wider">AI Explanation</h5>
                      </div>
                      <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed [overflow-wrap:anywhere] break-normal min-w-0" dangerouslySetInnerHTML={{ __html: question.explanation || 'No explanation provided.' }} />
                    </div>
                    
                    <div className="pt-4 mt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                       <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                         <ArrowRight size={16} /> Try a similar question
                       </button>
                    </div>
                  </div>
                </div>
              )}`;

if (code.includes(oldExplanation)) {
    code = code.replace(oldExplanation, newExplanation);
    fs.writeFileSync('src/components/Practice.tsx', code);
    console.log("Successfully replaced Explanation block!");
} else {
    // If Exact string isn't found because of tabs or spacing, we use regex
    const regex = /\{isSubmitted && \([\s\S]*?<\/div>\n              \)\}/;
    if (code.match(regex)) {
        code = code.replace(regex, newExplanation);
        fs.writeFileSync('src/components/Practice.tsx', code);
        console.log("Successfully replaced Explanation block using Regex!");
    } else {
        console.log("Could not find the block to replace.");
    }
}
