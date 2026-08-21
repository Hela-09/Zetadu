const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

let lastIndex = code.lastIndexOf(');');
code = code.substring(0, lastIndex) + '    </div>\n  ' + code.substring(lastIndex);

fs.writeFileSync('src/components/Tutor.tsx', code);
