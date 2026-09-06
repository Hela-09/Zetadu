const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

const targetCollections = [
  'user_progress',
  'tutor_sessions',
  'practice_sessions'
];

targetCollections.forEach(coll => {
  const oldStr = `    match /\${coll}/{docId} {\n      allow read, write: if isAuthenticated() && (docId == request.auth.uid || (resource != null && resource.data.uid == request.auth.uid) || (request.resource != null && request.resource.data.uid == request.auth.uid) || isSuperAdmin());\n    }`;
  
  const newStr = `    match /\${coll}/{docId} {\n      allow read: if isAuthenticated() && (docId == request.auth.uid || resource.data.uid == request.auth.uid || isSuperAdmin());\n      allow write: if isAuthenticated() && (docId == request.auth.uid || request.resource.data.uid == request.auth.uid || isSuperAdmin());\n    }`;
  
  code = code.replace(oldStr, newStr);
});

fs.writeFileSync('firestore.rules', code);
