const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

code = code.replace(
  "absolute lg:relative`}>",
  "absolute inset-y-0 left-0 z-50 lg:relative lg:inset-auto lg:z-auto`}>"
);

fs.writeFileSync('src/components/Tutor.tsx', code);
