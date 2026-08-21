import fs from 'fs';

let rules = fs.readFileSync('firestore.rules', 'utf8');

const oldUsersRule = `    match /users/{userId} {
      allow read: if isSignedIn();
      allow write: if isOwner(userId) || isSuperAdmin();
    }`;

const newUsersRule = `    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isOwner(userId) || isSuperAdmin();
      allow update: if (isOwner(userId) && (!request.resource.data.keys().hasAll(['role']) || request.resource.data.role == resource.data.role) && (!request.resource.data.keys().hasAll(['isSuperAdmin']) || request.resource.data.isSuperAdmin == resource.data.isSuperAdmin)) || isSuperAdmin();
      allow delete: if isSuperAdmin();
    }`;

rules = rules.replace(oldUsersRule, newUsersRule);
fs.writeFileSync('firestore.rules', rules);
