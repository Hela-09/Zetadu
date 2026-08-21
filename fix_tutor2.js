import fs from 'fs';

let content = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

content = content.replace(
  /<div className="whitespace-pre-wrap">\{msg\.text\}<\/div>[\s\n]*\{msg\.attachments/g,
  '<>\n<div className="whitespace-pre-wrap">{msg.text}</div>\n{msg.attachments'
);

content = content.replace(
  /<\/div>\n[\s\n]*\)\}\n[\s\n]*\) : \(/g,
  '</div>\n)}\n</>\n) : ('
);

fs.writeFileSync('src/components/Tutor.tsx', content);
