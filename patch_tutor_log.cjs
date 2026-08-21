const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');
code = code.replace(
  "throw new Error('Chat returned non-JSON response');",
  "const errText = await response.text(); throw new Error('Chat returned non-JSON response: ' + errText.substring(0, 100));"
);
fs.writeFileSync('src/components/Tutor.tsx', code);
