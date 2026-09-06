const fs = require('fs');
let fb = fs.readFileSync('src/lib/firebase.ts', 'utf8');

fb = fb.replace(`    import { disableNetwork } from "firebase/firestore";\n    disableNetwork(db).catch(console.warn);`, '');
fb = fb.replace(`// storage = getStorage(app); // Disabled until Storage is provisioned`, 'storage = getStorage(app);');

fs.writeFileSync('src/lib/firebase.ts', fb);
