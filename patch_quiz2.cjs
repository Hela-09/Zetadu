const fs = require('fs');
let code = fs.readFileSync('src/components/Quiz.tsx', 'utf8');

code = code.replace(
  "localStorage.removeItem('practice_session');",
  "localStorage.removeItem('practice_session');\n     localStorage.removeItem('zetadu_target_subject_id');\n     localStorage.removeItem('zetadu_target_subject');\n     localStorage.removeItem('zetadu_target_topic');"
);

fs.writeFileSync('src/components/Quiz.tsx', code);
