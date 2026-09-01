const fs = require('fs');
let code = fs.readFileSync('src/components/Home.tsx', 'utf8');

// The shortcuts block has <motion.button> ... </button> due to the global sed. Let's fix them to </motion.button>.
code = code.replace(/<motion\.button(.*?)<\/button>/gs, '<motion.button$1</motion.button>');

fs.writeFileSync('src/components/Home.tsx', code);
