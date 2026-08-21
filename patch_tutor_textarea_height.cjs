const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

code = code.replace(
  'Math.min(e.target.scrollHeight, 200) + \'px\';',
  'Math.min(e.target.scrollHeight, 300) + \'px\';'
);

// Also the send button styling to look a bit nicer inside a larger composer
code = code.replace(
  'className="shrink-0 p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors mb-0.5 sm:mb-0 shadow-md"',
  'className="shrink-0 p-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors mb-1 sm:mb-1 mr-1 shadow-md"'
);

fs.writeFileSync('src/components/Tutor.tsx', code);
