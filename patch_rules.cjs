const fs = require('fs');
let rules = fs.readFileSync('firestore.rules', 'utf8');

const functions = `    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(uid) {
      return isAuthenticated() && request.auth.uid == uid;
    }`;

const newFunctions = `    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(uid) {
      return isAuthenticated() && request.auth.uid == uid;
    }
    
    function isSuperAdmin() {
      return isAuthenticated() && exists(/databases/$(database)/documents/system/super_admin) &&
             get(/databases/$(database)/documents/system/super_admin).data.uid == request.auth.uid;
    }`;

if (rules.includes(functions) && !rules.includes('isSuperAdmin()')) {
  rules = rules.replace(functions, newFunctions);
}

const usersRule = `    match /users/{uid} {
      allow read, write: if isOwner(uid);
    }`;

const newUsersRule = `    match /users/{uid} {
      allow read: if isOwner(uid) || isSuperAdmin();
      allow write: if isOwner(uid) || isSuperAdmin();
    }`;

if (rules.includes(usersRule)) {
  rules = rules.replace(usersRule, newUsersRule);
}

fs.writeFileSync('firestore.rules', rules);
console.log('Rules patched');
