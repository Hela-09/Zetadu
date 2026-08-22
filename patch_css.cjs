const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

// Single line matches
code = code.replace('.dark .markdown-body h2 { border-bottom-color: var(--color-slate-700); }', 
`@media (prefers-color-scheme: dark) {
  .markdown-body h2 { border-bottom-color: var(--color-slate-700); }
}`);
code = code.replace('.dark .markdown-body a { color: var(--color-blue-400); }', 
`@media (prefers-color-scheme: dark) {
  .markdown-body a { color: var(--color-blue-400); }
}`);

// Multi line matches
code = code.replace(`.dark .markdown-body blockquote {
  color: var(--color-slate-400);
  border-left-color: var(--color-slate-700);
}`, 
`@media (prefers-color-scheme: dark) {
  .markdown-body blockquote {
    color: var(--color-slate-400);
    border-left-color: var(--color-slate-700);
  }
}`);

code = code.replace(`.dark .markdown-body code {
  background-color: var(--color-slate-800);
}`, 
`@media (prefers-color-scheme: dark) {
  .markdown-body code {
    background-color: var(--color-slate-800);
  }
}`);

code = code.replace(`.dark .markdown-body pre {
  background-color: var(--color-slate-800);
}`, 
`@media (prefers-color-scheme: dark) {
  .markdown-body pre {
    background-color: var(--color-slate-800);
  }
}`);

code = code.replace(`.dark .markdown-body table th,
.dark .markdown-body table td {
  border-color: var(--color-slate-700);
}`, 
`@media (prefers-color-scheme: dark) {
  .markdown-body table th,
  .markdown-body table td {
    border-color: var(--color-slate-700);
  }
}`);

code = code.replace(`.dark .markdown-body table tr {
  background-color: var(--color-slate-900);
  border-top-color: var(--color-slate-700);
}`, 
`@media (prefers-color-scheme: dark) {
  .markdown-body table tr {
    background-color: var(--color-slate-900);
    border-top-color: var(--color-slate-700);
  }
}`);

code = code.replace(`.dark .markdown-body table tr:nth-child(2n) {
  background-color: var(--color-slate-800);
}`, 
`@media (prefers-color-scheme: dark) {
  .markdown-body table tr:nth-child(2n) {
    background-color: var(--color-slate-800);
  }
}`);

code = code.replace(`.dark .glass-panel {
  background: rgba(15, 23, 42, 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}`, 
`@media (prefers-color-scheme: dark) {
  .glass-panel {
    background: rgba(15, 23, 42, 0.7);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
}`);

fs.writeFileSync('src/index.css', code);
console.log('patched css');
