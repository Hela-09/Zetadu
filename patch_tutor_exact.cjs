const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

// 1. Outer Container
code = code.replace(
  '<div className="w-full sm:w-[calc(100vw-32px)] xl:w-[1200px] sm:max-w-none xl:max-w-[1200px] h-[100dvh] sm:h-[calc(100dvh-16px)] xl:h-[calc(100vh-24px)] min-h-[100dvh] sm:min-h-[400px] xl:min-h-[700px] sm:my-[8px] xl:my-[12px] sm:mx-auto flex gap-0 lg:gap-4 bg-white dark:bg-slate-900 sm:rounded-[18px] lg:rounded-[20px] shadow-none sm:shadow-xl sm:border border-slate-200 dark:border-slate-800 overflow-hidden relative">',
  '<div className="w-full sm:w-[calc(100vw-32px)] xl:w-[min(1200px,calc(100vw-48px))] h-[100dvh] sm:h-[calc(100dvh-16px)] xl:h-[calc(100dvh-24px)] min-h-[100dvh] sm:min-h-[400px] xl:min-h-[700px] sm:my-[8px] xl:my-[12px] sm:mx-auto flex gap-0 lg:gap-4 bg-white dark:bg-slate-900 sm:rounded-[18px] lg:rounded-[20px] shadow-none sm:shadow-xl sm:border border-slate-200 dark:border-slate-800 overflow-hidden relative">'
);

// 2. Header
code = code.replace(
  '<div className="shrink-0 flex items-center gap-3 px-4 md:px-6 h-[64px] md:h-[72px] border-b border-slate-200 dark:border-slate-800">',
  '<div className="shrink-0 flex items-center gap-3 px-4 md:px-[24px] h-[64px] md:h-[72px] border-b border-slate-200 dark:border-slate-800 w-full">'
);

// 3. Conversation Area
code = code.replace(
  '<div className="mx-auto max-w-[950px] w-full px-4 sm:px-6 py-6 space-y-7 pb-32 md:pb-40">',
  '<div className="mx-auto w-[calc(100%-32px)] md:w-[calc(100%-48px)] max-w-[950px] py-6 space-y-7 pb-32 md:pb-40">'
);

// 4. Composer Outer
code = code.replace(
  '<div className="px-4 py-4 md:px-6 md:py-4 bg-white dark:bg-slate-900 border-t md:border-t-0 border-slate-200 dark:border-slate-800 shrink-0">',
  '<div className="bg-white dark:bg-slate-900 shrink-0 flex flex-col items-center w-full">'
);

code = code.replace(
  '<div className="mx-auto w-full" style={{ maxWidth: \'1050px\' }}>',
  '<div className="w-[calc(100%-32px)] md:w-[min(1050px,calc(100%-48px))] mx-auto">'
);

// Composer padding & height
code = code.replace(
  '<div className="relative w-full flex flex-col sm:flex-row items-end gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[20px] p-[20px] min-h-[100px] sm:min-h-[110px] md:min-h-[120px] focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all shadow-sm">',
  '<div className="relative w-full flex flex-col sm:flex-row items-end gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[20px] p-[20px] h-auto md:h-[120px] min-h-[100px] md:min-h-[120px] focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all shadow-sm mb-[16px]">'
);

code = code.replace(
  'style={{ minHeight: \'80px\', maxHeight: \'180px\' }}',
  'style={{ minHeight: \'80px\', maxHeight: \'180px\' }}'
);

// Disclaimer
code = code.replace(
  '<p className="text-center text-[12px] sm:text-[14px] text-slate-400 mt-4 md:mt-4 mb-2 md:mb-4">',
  '<p className="text-center text-[14px] text-slate-400 mb-[16px]">'
);

fs.writeFileSync('src/components/Tutor.tsx', code);
