const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

// Header
code = code.replace(
  '<div className="shrink-0 flex items-center gap-3 p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800">',
  '<div className="shrink-0 flex items-center gap-3 p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">'
);

// Inner chat wrapper padding
code = code.replace(
  '<div className="mx-auto max-w-[900px] w-full p-4 sm:p-6 md:p-8 space-y-8">',
  '<div className="mx-auto max-w-[900px] w-full p-4 sm:p-6 md:p-8 space-y-8 pb-32 md:pb-40">' // give extra space at bottom
);

// Input area wrapper
code = code.replace(
  '<div className="p-3 sm:p-4 sm:pb-6 bg-white dark:bg-slate-900 border-t sm:border-t-0 border-slate-200 dark:border-slate-800 shrink-0">',
  '<div className="p-4 sm:p-6 sm:pb-8 bg-white dark:bg-slate-900 border-t sm:border-t-0 border-slate-200 dark:border-slate-800 shrink-0">'
);

// Textarea input
code = code.replace(
  'style={{ minHeight: \'44px\', maxHeight: \'200px\' }}',
  'style={{ minHeight: \'56px\', maxHeight: \'300px\' }}'
);
code = code.replace(
  'className="flex-1 w-full bg-transparent border-none py-2.5 px-3 resize-none focus:outline-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-500"',
  'className="flex-1 w-full bg-transparent border-none py-4 px-4 text-base resize-none focus:outline-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-500"'
);

// Composer rounded container
code = code.replace(
  '<div className="relative flex flex-col sm:flex-row items-end gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all shadow-sm">',
  '<div className="relative flex flex-col sm:flex-row items-end gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-2 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all shadow-sm">'
);

// Scroll down button
code = code.replace(
  'bottom-[100px]',
  'bottom-[140px]'
);

fs.writeFileSync('src/components/Tutor.tsx', code);
