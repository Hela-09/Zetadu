const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

code = code.replace(
  '<div className={`text-[15px] leading-relaxed ${msg.role === \'tutor\' ? \'flex-1\' : \'\'} ${\n                    msg.role === \'user\'\n                      ? \'bg-blue-50 dark:bg-blue-900/20 text-slate-800 dark:text-slate-200 p-4 rounded-2xl rounded-tr-sm max-w-[85%] md:max-w-[800px] ml-auto\'\n                      : \'text-slate-800 dark:text-slate-200 py-2\'\n                  }`}>',
  '<div className={`text-[15px] leading-relaxed w-full max-w-[900px] min-w-0 ${msg.role === \'tutor\' ? \'flex-1\' : \'\'} ${\n                    msg.role === \'user\'\n                      ? \'bg-blue-50 dark:bg-blue-900/20 text-slate-800 dark:text-slate-200 p-4 rounded-2xl rounded-tr-sm\'\n                      : \'text-slate-800 dark:text-slate-200 py-2\'\n                  }`}>'
);

code = code.replace(
  '<div className="markdown-body prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-semibold prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-pre:border-slate-700/50">',
  '<div className="markdown-body prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-semibold prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-pre:border-slate-700/50 overflow-x-hidden">\n                        <style>{`\n                          .markdown-body pre { overflow-x: auto; max-width: 100%; }\n                          .markdown-body table { display: block; overflow-x: auto; max-width: 100%; }\n                          .markdown-body img { max-width: 100%; height: auto; }\n                          .markdown-body .math, .markdown-body .katex-display { overflow-x: auto; max-width: 100%; }\n                        `}</style>'
);

fs.writeFileSync('src/components/Tutor.tsx', code);
