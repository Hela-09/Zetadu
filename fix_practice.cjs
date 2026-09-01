const fs = require('fs');

let code = fs.readFileSync('src/components/Practice.tsx', 'utf8');

// The incorrect block starts around line 720:
// {isSubmitted && (
//   <div className={\`p-6 rounded-3xl border-2 mb-8 shadow-sm

// We can just find that block and replace it with the correct Exit Session code.
const regexWrongBlock = /\{isSubmitted && \([\s\S]*? Try a similar question[\s\S]*?<\/button>\n                    <\/div>\n                  <\/div>\n                <\/div>\n              \)\}/;

const restoreCode = `{isSubmitted && (
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
      )}`;

if (code.match(regexWrongBlock)) {
   code = code.replace(regexWrongBlock, restoreCode);
} else {
   console.log("Could not find the wrong block to remove.");
}

// Now we need to find the correct place to put the new explanation block.
// The old explanation block was around line 900. Let's see what is there now.
