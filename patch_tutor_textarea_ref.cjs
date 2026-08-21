const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

// 1. Add textarea ref
code = code.replace(
  'const scrollAreaRef = useRef<HTMLDivElement>(null);',
  'const scrollAreaRef = useRef<HTMLDivElement>(null);\n  const textareaRef = useRef<HTMLTextAreaElement>(null);'
);

// 2. Add ref to textarea
code = code.replace(
  '<textarea',
  '<textarea\n                ref={textareaRef}'
);

// 3. Reset height on handleSend
code = code.replace(
  'setInput(\'\');\n    setSelectedFiles([]);',
  'setInput(\'\');\n    setSelectedFiles([]);\n    if (textareaRef.current) {\n      textareaRef.current.style.height = \'auto\';\n    }'
);

fs.writeFileSync('src/components/Tutor.tsx', code);
