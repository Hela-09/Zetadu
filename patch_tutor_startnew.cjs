const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

code = code.replace(
  'const handleStartNew = () => {\n    setActiveConversationId(null);\n    setMessages([defaultInitialMessage]);',
  'const handleStartNew = () => {\n    setActiveConversationId(null);\n    setMessages([defaultInitialMessage]);\n    setSidebarOpen(false);'
);

fs.writeFileSync('src/components/Tutor.tsx', code);
