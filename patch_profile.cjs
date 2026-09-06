const fs = require('fs');
let code = fs.readFileSync('src/components/Profile.tsx', 'utf8');

const importAdd = `import { getLevelInfo } from '../lib/achievements';\n`;

if (!code.includes('../lib/achievements')) {
   code = code.replace("import { useAuth } from '../contexts/AuthContext';", "import { useAuth } from '../contexts/AuthContext';\nimport { getLevelInfo } from '../lib/achievements';");
}

const levelOld = `{userProfile?.level || 1}`;
const levelNew = `{getLevelInfo(userProfile?.xp || 0).level}`;

code = code.replace(levelOld, levelNew);

fs.writeFileSync('src/components/Profile.tsx', code);
