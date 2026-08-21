const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

// Fix the user bubble flex-1 issue so it sizes to content
code = code.replace(
  '<div className={`flex-1 text-[15px] leading-relaxed ${',
  '<div className={`text-[15px] leading-relaxed ${msg.role === \'tutor\' ? \'flex-1\' : \'\'} ${'
);

fs.writeFileSync('src/components/Tutor.tsx', code);
