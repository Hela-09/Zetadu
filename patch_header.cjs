const fs = require('fs');
let code = fs.readFileSync('src/components/Practice.tsx', 'utf8');

const oldHeader = `{/* CENTER */}
        <div className="flex flex-col justify-center min-w-0 flex-1 overflow-hidden">
          <h2 className="font-bold text-slate-900 dark:text-white truncate text-base sm:text-lg md:text-xl leading-tight mb-1 w-full block">
            {subject} {topic && \`- \${topic}\`}
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate w-full block">
            Question {currentQIndex + 1} of {questions.length}
          </p>
        </div>`;

const newHeader = `{/* CENTER */}
        <div className="flex flex-col justify-center min-w-0 flex-1 overflow-hidden pr-2 sm:pr-6">
          <h2 className="font-bold text-slate-900 dark:text-white truncate text-base sm:text-lg md:text-xl leading-tight mb-1.5 w-full block">
            {subject} {topic && \`- \${topic}\`}
          </h2>
          <div className="flex items-center gap-2 sm:gap-3 w-full max-w-md">
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Q {currentQIndex + 1} of {questions.length}
            </p>
            <div className="flex-1 h-1.5 sm:h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shrink-0 hidden sm:block">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: \`\${Math.round((answeredCount / questions.length) * 100)}%\` }}
              ></div>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 tabular-nums w-[3ch] shrink-0 text-right hidden sm:block">
              {Math.round((answeredCount / questions.length) * 100)}%
            </span>
          </div>
        </div>`;

code = code.replace(oldHeader, newHeader);
fs.writeFileSync('src/components/Practice.tsx', code);
console.log('Header patched');
