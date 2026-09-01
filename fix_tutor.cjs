const fs = require('fs');

let file = 'src/components/Tutor.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  'h-full sm:min-h-[400px] xl:min-h-[700px] sm:my-[8px] xl:my-[12px] sm:mx-auto', 
  'h-full sm:h-[calc(100%-16px)] xl:h-[calc(100%-24px)] sm:min-h-[400px] xl:min-h-[700px] sm:my-[8px] xl:my-[12px] sm:mx-auto'
);

// Also check the textarea in Tutor.tsx to ensure it scales correctly without overlapping
// "Make the AI Tutor conversation and message composer stable."
// There's a known issue where textarea scrolling might bounce or layout shifts.
code = code.replace(
  /className="flex-1 min-w-0 w-full bg-transparent border-none py-\[12px\] px-2 text-\[16px\] md:text-\[17px\] leading-\[24px\] resize-none focus:outline-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-500 self-center no-scrollbar"/g,
  'className="flex-1 min-w-0 w-full bg-transparent border-none py-[12px] px-2 text-[16px] md:text-[17px] leading-[24px] resize-none focus:outline-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-500 self-center max-h-[160px] overflow-y-auto no-scrollbar"'
);

fs.writeFileSync(file, code);

console.log("Fixed Tutor height and textarea");
