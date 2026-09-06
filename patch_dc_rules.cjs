const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

const dailyChallengeOld = `    match /daily_challenges/{docId} {
      allow read: if isAuthenticated() && (resource == null || resource.data.uid == request.auth.uid);
      allow write: if isAuthenticated() && request.resource.data.uid == request.auth.uid;
    }`;
const dailyChallengeNew = `    match /daily_challenges/{docId} {
      allow read: if isAuthenticated() && docId.split('_')[0] == request.auth.uid;
      allow write: if isAuthenticated() && request.resource.data.uid == request.auth.uid;
    }`;
code = code.replace(dailyChallengeOld, dailyChallengeNew);

fs.writeFileSync('firestore.rules', code);
