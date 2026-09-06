const fs = require('fs');

const newRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isSuperAdmin() {
      return isAuthenticated() && 'email' in request.auth.token && request.auth.token.email == 'emmanuelomojola07@gmail.com';
    }

    match /users/{uid} {
      allow read, write: if isAuthenticated() && (request.auth.uid == uid || isSuperAdmin());
    }
    
    match /settings/{uid} {
      allow read, write: if isAuthenticated() && (request.auth.uid == uid || isSuperAdmin());
    }
    
    match /bookmarks/{uid} {
      allow read, write: if isAuthenticated() && (request.auth.uid == uid || isSuperAdmin());
    }
    
    match /notes/{uid} {
      allow read, write: if isAuthenticated() && (request.auth.uid == uid || isSuperAdmin());
    }

    match /system/super_admin {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() && resource.data.uid == request.auth.uid;
    }

    match /learning_data/{docId} {
      allow get: if isAuthenticated() && (resource.data.uid == request.auth.uid || isSuperAdmin());
      allow list: if isAuthenticated() && resource.data.uid == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.uid == request.auth.uid;
      allow update: if isAuthenticated() && (resource.data.uid == request.auth.uid && request.resource.data.uid == request.auth.uid) || isSuperAdmin();
      allow delete: if isAuthenticated() && (resource.data.uid == request.auth.uid || isSuperAdmin());
    }

    match /ai_history/{docId} {
      allow get: if isAuthenticated() && (resource.data.uid == request.auth.uid || isSuperAdmin());
      allow list: if isAuthenticated() && resource.data.uid == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.uid == request.auth.uid;
      allow update: if isAuthenticated() && (resource.data.uid == request.auth.uid && request.resource.data.uid == request.auth.uid) || isSuperAdmin();
      allow delete: if isAuthenticated() && (resource.data.uid == request.auth.uid || isSuperAdmin());
    }

    match /user_progress/{docId} {
      allow get: if isAuthenticated() && (docId == request.auth.uid || isSuperAdmin());
      allow list: if isAuthenticated() && resource.data.uid == request.auth.uid;
      allow write: if isAuthenticated() && (docId == request.auth.uid || request.resource.data.uid == request.auth.uid || isSuperAdmin());
    }

    match /tutor_conversations/{docId} {
      allow get: if isAuthenticated() && (resource.data.uid == request.auth.uid || isSuperAdmin());
      allow list: if isAuthenticated() && resource.data.uid == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.uid == request.auth.uid;
      allow update: if isAuthenticated() && (resource.data.uid == request.auth.uid && request.resource.data.uid == request.auth.uid) || isSuperAdmin();
      allow delete: if isAuthenticated() && (resource.data.uid == request.auth.uid || isSuperAdmin());
    }

    match /tutor_sessions/{docId} {
      allow read, write: if isAuthenticated() && (docId == request.auth.uid || isSuperAdmin());
    }

    match /practice_sessions/{docId} {
      allow read, write: if isAuthenticated() && (docId == request.auth.uid || isSuperAdmin());
    }

    match /daily_challenges/{docId} {
      allow get: if isAuthenticated() && (resource.data.uid == request.auth.uid || isSuperAdmin());
      allow list: if isAuthenticated() && resource.data.uid == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.uid == request.auth.uid;
      allow update: if isAuthenticated() && (resource.data.uid == request.auth.uid && request.resource.data.uid == request.auth.uid) || isSuperAdmin();
      allow delete: if isAuthenticated() && (resource.data.uid == request.auth.uid || isSuperAdmin());
    }

    match /subject_history/{docId} {
      allow get: if isAuthenticated() && (resource.data.uid == request.auth.uid || isSuperAdmin());
      allow list: if isAuthenticated() && resource.data.uid == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.uid == request.auth.uid;
      allow update: if isAuthenticated() && (resource.data.uid == request.auth.uid && request.resource.data.uid == request.auth.uid) || isSuperAdmin();
      allow delete: if isAuthenticated() && (resource.data.uid == request.auth.uid || isSuperAdmin());
    }
  }
}
`;

fs.writeFileSync('firestore.rules', newRules);
