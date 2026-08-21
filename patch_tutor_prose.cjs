const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

code = code.replace(
  'className="markdown-body text-sm prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-pre:border-slate-700/50"',
  'className="markdown-body prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-semibold prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-pre:border-slate-700/50"'
);

fs.writeFileSync('src/components/Tutor.tsx', code);
