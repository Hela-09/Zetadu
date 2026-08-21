const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

// Replace the composer's outer div constraints
code = code.replace(
  '<div className="w-[calc(100%-32px)] md:w-[min(1050px,calc(100%-48px))] mx-auto">',
  '<div className="w-[calc(100%-24px)] md:w-[calc(100%-48px)] max-w-[900px] mx-auto">'
);

// Replace the composer container styling
code = code.replace(
  '<div className="relative w-full flex flex-col sm:flex-row items-end gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[20px] p-[20px] h-auto md:h-[120px] min-h-[100px] md:min-h-[120px] focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all shadow-sm mb-[16px]">',
  '<div className="relative w-full flex flex-row items-end gap-1 md:gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[18px] md:rounded-[20px] p-[10px_12px] md:p-[12px_16px] min-h-[68px] md:min-h-[78px] focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all shadow-sm mb-[16px]">'
);

// Remove the `sm:px-0 sm:py-2` from the attachment button container to make it vertically centered
code = code.replace(
  '<div className="flex gap-1 shrink-0 px-2 sm:px-0 sm:py-2 text-slate-400">',
  '<div className="flex gap-1 shrink-0 text-slate-400 items-center justify-center">'
);

// Textarea constraints
code = code.replace(
  '<textarea\n                ref={textareaRef}\n                value={input}\n                onChange={(e) => {\n                  setInput(e.target.value);\n                  e.target.style.height = \'auto\';\n                  e.target.style.height = Math.min(e.target.scrollHeight, 180) + \'px\';\n                }}\n                onKeyDown={handleKeyDown}\n                placeholder="Ask your AI tutor..."\n                className="flex-1 w-full bg-transparent border-none py-2 md:py-3 px-3 md:px-4 text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] resize-none focus:outline-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-500"\n                rows={1}\n                style={{ minHeight: \'80px\', maxHeight: \'180px\' }}\n              />',
  '<textarea\n                ref={textareaRef}\n                value={input}\n                onChange={(e) => {\n                  setInput(e.target.value);\n                  e.target.style.height = \'auto\';\n                  const maxHeight = window.innerWidth >= 768 ? 160 : 140;\n                  e.target.style.height = Math.min(e.target.scrollHeight, maxHeight) + \'px\';\n                }}\n                onKeyDown={handleKeyDown}\n                placeholder="Ask your AI tutor..."\n                className="flex-1 w-full bg-transparent border-none py-[12px] px-2 text-[16px] md:text-[17px] leading-[24px] resize-none focus:outline-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-500 self-center"\n                rows={1}\n                style={{ minHeight: \'24px\', height: \'24px\' }}\n              />'
);

// Send button
code = code.replace(
  '<button\n                onClick={handleSend}\n                disabled={(!input.trim() && selectedFiles.length === 0) || isLoading || isUploading}\n                className="shrink-0 w-[48px] h-[48px] md:w-[56px] md:h-[56px] flex items-center justify-center rounded-[14px] md:rounded-[16px] bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-md"\n              >',
  '<button\n                onClick={handleSend}\n                disabled={(!input.trim() && selectedFiles.length === 0) || isLoading || isUploading}\n                className="shrink-0 w-[48px] h-[48px] flex items-center justify-center rounded-[14px] bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-md"\n              >'
);

fs.writeFileSync('src/components/Tutor.tsx', code);
