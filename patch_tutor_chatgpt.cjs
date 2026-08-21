const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

// 1. Expand layout wrapper
code = code.replace(
  '<div className="w-full h-full mx-auto flex pb-4 gap-4 max-w-6xl absolute inset-0">',
  '<div className="w-full h-full flex pb-0 sm:pb-4 gap-0 sm:gap-4 absolute inset-0">'
);

// 2. Adjust sidebar
code = code.replace(
  'w-full sm:w-80 flex-col bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden',
  'w-full sm:w-[260px] md:w-[300px] flex-col bg-slate-50 dark:bg-slate-800/50 sm:rounded-3xl border-r sm:border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden'
);

// 3. Main Chat Area adjustments
code = code.replace(
  '<div className="flex-1 bento-card p-0 dark:bg-slate-800 dark:border-slate-700/50 flex flex-col overflow-hidden relative min-h-0">',
  '<div className="flex-1 bg-white dark:bg-slate-900 sm:rounded-3xl sm:border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden relative min-h-0 shadow-sm">'
);

// 4. Center messages and input
code = code.replace(
  '<div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">',
  '<div className="flex-1 overflow-y-auto">\n            <div className="mx-auto max-w-[900px] w-full p-4 sm:p-6 md:p-8 space-y-8">'
);

// 5. Close the centered wrapper div
code = code.replace(
  '            <div ref={messagesEndRef} />\n          </div>',
  '            <div ref={messagesEndRef} />\n            </div>\n          </div>'
);

// 6. Fix message bubbles (don't restrict to 85%, use full width of max-w-[900px])
code = code.replace(
  'className={`flex gap-3 md:gap-4 max-w-[95%] md:max-w-[85%] ${msg.role === \'user\' ? \'ml-auto flex-row-reverse\' : \'\'}`}',
  'className={`flex gap-4 md:gap-6 w-full ${msg.role === \'user\' ? \'flex-row-reverse\' : \'\'}`}'
);

// 7. Styling for AI vs User
code = code.replace(
  '<div className={`p-4 rounded-2xl text-[15px] leading-relaxed ${',
  '<div className={`flex-1 text-[15px] leading-relaxed ${'
);

code = code.replace(
  'msg.role === \'user\'\n                      ? \'bg-blue-600 text-white rounded-tr-sm\'\n                      : \'bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-200 dark:border-slate-700/50\'',
  'msg.role === \'user\'\n                      ? \'bg-blue-50 dark:bg-blue-900/20 text-slate-800 dark:text-slate-200 p-4 rounded-2xl rounded-tr-sm max-w-[85%] ml-auto\'\n                      : \'text-slate-800 dark:text-slate-200 py-2\''
);

// 8. Fix loading bubble
code = code.replace(
  'className="flex gap-3 md:gap-4 max-w-[95%] md:max-w-[85%]"',
  'className="flex gap-4 md:gap-6 w-full"'
);
code = code.replace(
  '<div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-700/50 rounded-tl-sm border border-slate-200 dark:border-slate-700/50 flex items-center h-[56px]">',
  '<div className="flex-1 py-2 flex items-center h-[56px] text-slate-800 dark:text-slate-200">'
);

// 9. Input area centering
code = code.replace(
  '<div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">',
  '<div className="p-3 sm:p-4 sm:pb-6 bg-white dark:bg-slate-900 border-t sm:border-t-0 border-slate-200 dark:border-slate-800 shrink-0">\n            <div className="mx-auto max-w-[900px] w-full">'
);

code = code.replace(
  '<p className="text-center text-[10px] sm:text-xs text-slate-400 mt-2">\n              AI can make mistakes. Verify important information.\n            </p>\n          </div>',
  '<p className="text-center text-[10px] sm:text-xs text-slate-400 mt-2 sm:mt-3">\n              AI can make mistakes. Verify important information.\n            </p>\n            </div>\n          </div>'
);

// 10. Improve Composer styling
code = code.replace(
  '<div className="relative flex flex-col sm:flex-row items-end gap-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all shadow-sm">',
  '<div className="relative flex flex-col sm:flex-row items-end gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all shadow-sm">'
);
code = code.replace(
  'className="flex-1 w-full bg-transparent border-none py-2 px-2 resize-none focus:outline-none focus:ring-0 dark:text-white"',
  'className="flex-1 w-full bg-transparent border-none py-2.5 px-3 resize-none focus:outline-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-500"'
);
code = code.replace(
  'style={{ minHeight: \'44px\', maxHeight: \'120px\' }}',
  'style={{ minHeight: \'44px\', maxHeight: \'200px\' }}'
);
code = code.replace(
  'className="shrink-0 p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors mb-0.5 sm:mb-0 shadow-sm"',
  'className="shrink-0 p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors mb-0.5 sm:mb-0 shadow-md"'
);

fs.writeFileSync('src/components/Tutor.tsx', code);
