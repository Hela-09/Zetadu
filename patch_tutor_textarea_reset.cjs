const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

code = code.replace(
  'setInput(\'\');\n    localStorage.removeItem(\'tutor_active_conv\');',
  'setInput(\'\');\n    if (textareaRef.current) {\n      textareaRef.current.style.height = \'auto\';\n    }\n    localStorage.removeItem(\'tutor_active_conv\');'
);

fs.writeFileSync('src/components/Tutor.tsx', code);
