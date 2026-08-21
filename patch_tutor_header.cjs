const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

// Insert Back button before the sidebar toggle button or next to it
code = code.replace(
  '<div className="shrink-0 flex items-center gap-3 px-4 md:px-[24px] h-[64px] md:h-[72px] border-b border-slate-200 dark:border-slate-800 w-full">',
  '<div className="shrink-0 flex items-center gap-2 md:gap-3 px-2 md:px-[24px] h-[56px] md:h-[72px] border-b border-slate-200 dark:border-slate-800 w-full">\n          {setCurrentView && (\n            <button \n              onClick={() => setCurrentView(\'home\')}\n              className="flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium text-sm"\n              title="Back to Home"\n            >\n              <ArrowLeft size={20} />\n              <span className="hidden md:inline">Back</span>\n            </button>\n          )}'
);

// We should fix the title truncate logic for mobile as requested: "overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
code = code.replace(
  '<h2 className="text-lg md:text-[20px] font-semibold text-slate-900 dark:text-white truncate">',
  '<h2 className="text-[17px] md:text-[20px] font-semibold text-slate-900 dark:text-white overflow-hidden text-ellipsis whitespace-nowrap">'
);

fs.writeFileSync('src/components/Tutor.tsx', code);
