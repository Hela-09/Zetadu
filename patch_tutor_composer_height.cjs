const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

// Update header padding
code = code.replace(
  'px-2 md:px-[24px] h-[56px] md:h-[72px]',
  'px-[12px] md:px-[24px] h-[56px] md:h-[72px]'
);

// Update textarea
code = code.replace(
  '<textarea\n                ref={textareaRef}\n                value={input}\n                onChange={(e) => {\n                  setInput(e.target.value);\n                  e.target.style.height = \'auto\';\n                  const maxHeight = window.innerWidth >= 768 ? 160 : 140;\n                  e.target.style.height = Math.min(e.target.scrollHeight, maxHeight) + \'px\';\n                }}\n                onKeyDown={handleKeyDown}\n                placeholder="Ask your AI tutor..."\n                className="flex-1 w-full bg-transparent border-none py-[12px] px-2 text-[16px] md:text-[17px] leading-[24px] resize-none focus:outline-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-500 self-center"\n                rows={1}\n                style={{ minHeight: \'24px\', height: \'24px\' }}\n              />',
  '<textarea\n                ref={textareaRef}\n                value={input}\n                onChange={(e) => {\n                  setInput(e.target.value);\n                  e.target.style.height = \'auto\';\n                  const maxHeight = window.innerWidth >= 768 ? 160 : 140;\n                  e.target.style.height = Math.min(e.target.scrollHeight, maxHeight) + \'px\';\n                }}\n                onKeyDown={handleKeyDown}\n                placeholder="Ask your AI tutor..."\n                className="flex-1 w-full bg-transparent border-none py-[12px] px-2 text-[16px] md:text-[17px] leading-[24px] resize-none focus:outline-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-500 self-center"\n                rows={1}\n                style={{ minHeight: \'24px\' }}\n              />'
);

fs.writeFileSync('src/components/Tutor.tsx', code);
