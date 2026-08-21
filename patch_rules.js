import fs from 'fs';

const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
    
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(uid) {
      return isSignedIn() && request.auth.uid == uid;
    }

    function isSuperAdmin() {
      return isSignedIn() && exists(/databases/$(database)/documents/system/super_admin) && get(/databases/$(database)/documents/system/super_admin).data.uid == request.auth.uid;
    }

    match /system/super_admin {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && request.resource.data.uid == request.auth.uid && !exists(/databases/$(database)/documents/system/super_admin);
      allow update, delete: if isSuperAdmin();
    }

    match /users/{userId} {
      allow read: if isSignedIn();
      allow write: if isOwner(userId) || isSuperAdmin();
    }
    
    match /settings/{docId} {
      allow read: if isSignedIn() && (resource == null || resource.data.uid == request.auth.uid) || isSuperAdmin();
      allow create: if isSignedIn() && request.resource.data.uid == request.auth.uid || isSuperAdmin();
      allow update, delete: if isSignedIn() && resource.data.uid == request.auth.uid || isSuperAdmin();
    }

    match /learning_data/{docId} {
      allow read: if isSignedIn() && (resource == null || resource.data.uid == request.auth.uid) || isSuperAdmin();
      allow create: if isSignedIn() && request.resource.data.uid == request.auth.uid || isSuperAdmin();
      allow update, delete: if isSignedIn() && resource.data.uid == request.auth.uid || isSuperAdmin();
    }

    match /ai_history/{docId} {
      allow read: if isSignedIn() && (resource == null || resource.data.uid == request.auth.uid) || isSuperAdmin();
      allow create: if isSignedIn() && request.resource.data.uid == request.auth.uid || isSuperAdmin();
      allow update, delete: if isSignedIn() && resource.data.uid == request.auth.uid || isSuperAdmin();
    }

    match /user_progress/{docId} {
      allow read: if isSignedIn() && (resource == null || resource.data.uid == request.auth.uid) || isSuperAdmin();
      allow create: if isSignedIn() && request.resource.data.uid == request.auth.uid || isSuperAdmin();
      allow update, delete: if isSignedIn() && resource.data.uid == request.auth.uid || isSuperAdmin();
    }

    match /bookmarks/{docId} {
      allow read: if isSignedIn() && (resource == null || resource.data.uid == request.auth.uid) || isSuperAdmin();
      allow create: if isSignedIn() && request.resource.data.uid == request.auth.uid || isSuperAdmin();
      allow update, delete: if isSignedIn() && resource.data.uid == request.auth.uid || isSuperAdmin();
    }
    
    match /notes/{docId} {
      allow read: if isSignedIn() && (resource == null || resource.data.uid == request.auth.uid) || isSuperAdmin();
      allow create: if isSignedIn() && request.resource.data.uid == request.auth.uid || isSuperAdmin();
      allow update, delete: if isSignedIn() && resource.data.uid == request.auth.uid || isSuperAdmin();
    }
    
    match /practice_sessions/{userId} {
      allow read, write: if isOwner(userId) || isSuperAdmin();
    }

    match /tutor_sessions/{userId} {
      allow read, write: if isOwner(userId) || isSuperAdmin();
    }
  }
}`;

fs.writeFileSync('firestore.rules', rules);
