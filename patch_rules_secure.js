import fs from 'fs';

let rules = fs.readFileSync('firestore.rules', 'utf8');

rules = rules.replace(
  '    match /system/super_admin {\n      allow read: if isSignedIn();',
  '    match /system/super_admin {\n      allow read: if isSuperAdmin();'
);

fs.writeFileSync('firestore.rules', rules);
