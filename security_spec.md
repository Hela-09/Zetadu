# Security Rules Specification

## learning_data
- Authentication: Required. User must be authenticated.
- Authorization: Users can only read and write their own documents (request.auth.uid == resource.data.uid).
- Data Validation: Ensure 'uid' matches request.auth.uid.

## ai_history
- Authentication: Required. User must be authenticated.
- Authorization: Users can only read and write their own documents (request.auth.uid == resource.data.uid).
- Data Validation: Ensure 'uid' matches request.auth.uid.

## user_progress
- Authentication: Required. User must be authenticated.
- Authorization: Users can only read and write their own documents (request.auth.uid == resource.data.uid).
- Data Validation: Ensure 'uid' matches request.auth.uid.

## tutor_conversations
- Authentication: Required. User must be authenticated.
- Authorization: Users can only read and write their own documents (request.auth.uid == resource.data.uid).
- Data Validation: Ensure 'uid' matches request.auth.uid.

## practice_sessions
- Authentication: Required. User must be authenticated.
- Authorization: Users can only read and write their own documents (request.auth.uid == docId or request.auth.uid == resource.data.uid).
- Data Validation: Ensure 'uid' matches request.auth.uid if present.

## subject_history
- Authentication: Required. User must be authenticated.
- Authorization: Users can only read and write their own documents (request.auth.uid == resource.data.uid).
- Data Validation: Ensure 'uid' matches request.auth.uid.

