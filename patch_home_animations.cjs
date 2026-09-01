const fs = require('fs');
let code = fs.readFileSync('src/components/Home.tsx', 'utf8');

// 1. Stagger the quick action cards
const actionTarget1 = `              <button onClick={() => setView('subjects')} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group">`;
const actionTarget2 = `              <button onClick={() => setView('practice')} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group">`;
const actionTarget3 = `              <button onClick={() => setView('tutor')} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group">`;

code = code.replace(actionTarget1, `              <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }} onClick={() => setView('subjects')} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group">`);
code = code.replace(`</button>`, `</motion.button>`); // Replace the first closing button, might be tricky, let's just do it directly.

fs.writeFileSync('src/components/Home.tsx', code);
