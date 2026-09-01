const fs = require('fs');
let code = fs.readFileSync('src/components/Practice.tsx', 'utf8');

const qOld = `className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-8 leading-relaxed whitespace-pre-wrap"`;
const qNew = `className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-8 leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere] break-normal min-w-0"`;
code = code.replace(qOld, qNew);

const optOld = `<span className={\`font-medium flex-1 text-lg \${isSubmitted ? '' : 'text-slate-700 dark:text-slate-200'}\`}>`;
const optNew = `<span className={\`font-medium flex-1 text-lg [overflow-wrap:anywhere] break-normal min-w-0 \${isSubmitted ? '' : 'text-slate-700 dark:text-slate-200'}\`}>`;
code = code.replace(optOld, optNew);

fs.writeFileSync('src/components/Practice.tsx', code);
console.log('Text wrapping patched');
