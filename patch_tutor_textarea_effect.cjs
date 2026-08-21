const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

code = code.replace(
  'const [input, setInput] = useState(\'\');\n  const [isLoading, setIsLoading] = useState(false);',
  'const [input, setInput] = useState(\'\');\n  const [isLoading, setIsLoading] = useState(false);\n  useEffect(() => {\n    if (textareaRef.current) {\n      if (input === \'\') {\n        textareaRef.current.style.height = \'24px\';\n      } else {\n        textareaRef.current.style.height = \'auto\';\n        const maxHeight = window.innerWidth >= 768 ? 160 : 140;\n        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, maxHeight) + \'px\';\n      }\n    }\n  }, [input]);'
);

fs.writeFileSync('src/components/Tutor.tsx', code);
