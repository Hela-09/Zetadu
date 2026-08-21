const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

code = code.replace(
  '<div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0" ref={scrollAreaRef} onScroll={handleScroll}>',
  '<div className="flex-1 overflow-y-scroll overflow-x-hidden min-h-0" ref={scrollAreaRef} onScroll={handleScroll}>'
);

fs.writeFileSync('src/components/Tutor.tsx', code);
