const fs = require('fs');
let fb = fs.readFileSync('src/lib/firebase.ts', 'utf8');

// Replace the disabled db line with disableNetwork
fb = fb.replace(
  '// db = getFirestore(app); // Disabled until DB is provisioned',
  `db = getFirestore(app);
    import { disableNetwork } from "firebase/firestore";
    disableNetwork(db).catch(console.warn);`
);

// We need to add the import if it's not there.
if (!fb.includes('disableNetwork')) {
  fb = fb.replace('getFirestore, Firestore', 'getFirestore, Firestore, disableNetwork');
  fb = fb.replace('// db = getFirestore(app); // Disabled until DB is provisioned', 'db = getFirestore(app); disableNetwork(db).catch(console.error);');
}

fs.writeFileSync('src/lib/firebase.ts', fb);
