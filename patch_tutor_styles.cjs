const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

// 1. Sidebar width
code = code.replace(
  'w-full sm:w-[260px] md:w-[300px]',
  'w-full lg:w-[280px] lg:min-w-[240px] lg:max-w-[300px]'
);
// Remove sidebar internal rounded border if it's on the edge, actually we can keep the border-r
code = code.replace(
  'sm:rounded-3xl border-r sm:border',
  'border-r border-slate-200 dark:border-slate-800'
);
code = code.replace(
  'bg-slate-50 dark:bg-slate-800/50',
  'bg-slate-50 dark:bg-slate-900/50'
);

// 2. Remove inner container extra borders and backgrounds in Main Chat Area
code = code.replace(
  '<div className="flex-1 bg-white dark:bg-slate-900 sm:rounded-3xl sm:border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden relative min-h-0 shadow-sm">',
  '<div className="flex-1 flex flex-col overflow-hidden relative min-h-0">'
);

// 3. Header styles
code = code.replace(
  '<div className="shrink-0 flex items-center gap-3 p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">',
  '<div className="shrink-0 flex items-center gap-3 px-4 md:px-6 h-[64px] md:h-[72px] border-b border-slate-200 dark:border-slate-800">'
);
code = code.replace(
  '<h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">',
  '<h2 className="text-lg md:text-[20px] font-semibold text-slate-900 dark:text-white truncate">'
);

// 4. Conversation area padding
code = code.replace(
  '<div className="mx-auto max-w-[900px] w-full p-4 sm:p-6 md:p-8 space-y-8 pb-32 md:pb-40">',
  '<div className="mx-auto max-w-[900px] w-full px-4 sm:px-6 py-6 space-y-7 pb-32 md:pb-40">'
);

// 5. Message spacing and width
code = code.replace(
  'gap-4 md:gap-6',
  'gap-4 md:gap-5'
);
// Make AI text not max-width 85%, wait AI text is flex-1 already.
// Update user max-width
code = code.replace(
  'max-w-[85%]',
  'max-w-[85%] md:max-w-[800px]'
);

// 6. Composer Input Area
code = code.replace(
  '<div className="p-4 sm:p-6 sm:pb-8 bg-white dark:bg-slate-900 border-t sm:border-t-0 border-slate-200 dark:border-slate-800 shrink-0">',
  '<div className="p-4 md:p-5 md:pb-4 bg-white dark:bg-slate-900 border-t md:border-t-0 border-slate-200 dark:border-slate-800 shrink-0">'
);
code = code.replace(
  '<div className="mx-auto max-w-[900px] w-full">',
  '<div className="mx-auto w-full" style={{ maxWidth: \'1050px\' }}>'
);
code = code.replace(
  'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-2 focus-within:ring-2',
  'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[20px] p-2 md:p-3 focus-within:ring-2'
);
code = code.replace(
  'className="flex-1 w-full bg-transparent border-none py-4 px-4 text-base resize-none focus:outline-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-500"',
  'className="flex-1 w-full bg-transparent border-none py-2 md:py-3 px-3 md:px-4 text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] resize-none focus:outline-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-500"'
);
code = code.replace(
  'style={{ minHeight: \'56px\', maxHeight: \'300px\' }}',
  'style={{ minHeight: \'60px\', maxHeight: \'180px\' }}'
);
code = code.replace(
  'Math.min(e.target.scrollHeight, 300) + \'px\';',
  'Math.min(e.target.scrollHeight, 180) + \'px\';'
);

// 7. Buttons
// Attachment button
code = code.replace(
  '<button\n                type="button"\n                onClick={() => document.getElementById(\'file-upload\')?.click()}\n                className="shrink-0 p-3 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700 transition-colors mb-0.5 sm:mb-0"\n                title="Attach file"\n              >',
  '<button\n                type="button"\n                onClick={() => document.getElementById(\'file-upload\')?.click()}\n                className="shrink-0 w-[44px] h-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700 transition-colors mb-1 sm:mb-1"\n                title="Attach file"\n              >'
);
// Send button
code = code.replace(
  '<button\n                onClick={handleSend}\n                disabled={(!input.trim() && selectedFiles.length === 0) || isLoading || isUploading}\n                className="shrink-0 p-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors mb-1 sm:mb-1 mr-1 shadow-md"\n              >',
  '<button\n                onClick={handleSend}\n                disabled={(!input.trim() && selectedFiles.length === 0) || isLoading || isUploading}\n                className="shrink-0 w-[48px] h-[48px] md:w-[56px] md:h-[56px] flex items-center justify-center rounded-[14px] md:rounded-[16px] bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors mb-0 md:mb-1 mr-0 md:mr-1 shadow-md"\n              >'
);

// 8. Disclaimer
code = code.replace(
  '<p className="text-center text-[10px] sm:text-xs text-slate-400 mt-2 sm:mt-3">',
  '<p className="text-center text-[12px] sm:text-[14px] text-slate-400 mt-4 md:mt-4 mb-2 md:mb-4">'
);

fs.writeFileSync('src/components/Tutor.tsx', code);
