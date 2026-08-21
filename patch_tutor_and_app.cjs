const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

appCode = appCode.replace(
  '<main className={`flex-1 flex flex-col h-full relative ${currentView === \'tutor\' ? \'p-0 overflow-hidden\' : \'p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto\'}`}>',
  '<main className={`flex-1 flex flex-col h-full overflow-hidden relative ${currentView === \'tutor\' ? \'p-0\' : \'p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto\'}`}>'
);

appCode = appCode.replace(
  '<header className={`flex justify-between items-center shrink-0 gap-4 flex-wrap ${currentView === \'tutor\' ? \'p-4 md:px-8 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 z-10 hidden\' : \'mb-6 md:mb-8\'}`}>',
  '<header className={`flex justify-between items-center shrink-0 gap-4 flex-wrap ${currentView === \'tutor\' ? \'hidden\' : \'mb-6 md:mb-8\'}`}>'
);

fs.writeFileSync('src/App.tsx', appCode);

let tutorCode = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

tutorCode = tutorCode.replace(
  '<div className="w-full h-[100dvh] flex items-center justify-center absolute inset-0 bg-transparent sm:bg-slate-100/50 dark:sm:bg-slate-950/50">\n      <div className="w-full sm:w-[calc(100%-32px)] lg:w-[calc(100%-48px)] max-w-[1280px] h-[100dvh] sm:h-[calc(100dvh-32px)] min-h-[400px] flex gap-0 lg:gap-4 bg-white dark:bg-slate-900 sm:rounded-[18px] lg:rounded-[20px] shadow-none sm:shadow-xl sm:border border-slate-200 dark:border-slate-800 overflow-hidden relative">',
  '<div className="w-full h-full flex items-center justify-center absolute inset-0 bg-white dark:bg-slate-900 sm:bg-slate-100 dark:sm:bg-slate-950">\n      <div className="w-full sm:w-[calc(100%-32px)] lg:w-[calc(100%-48px)] max-w-[1200px] h-full sm:h-[calc(100%-32px)] min-h-[400px] flex gap-0 lg:gap-4 bg-white dark:bg-slate-900 sm:rounded-[18px] lg:rounded-[20px] shadow-none sm:shadow-xl sm:border border-slate-200 dark:border-slate-800 overflow-hidden relative">'
);

fs.writeFileSync('src/components/Tutor.tsx', tutorCode);
