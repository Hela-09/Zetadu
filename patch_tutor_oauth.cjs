const fs = require('fs');
let content = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

content = content.replace(
  'const { user, getToken, userProfile, settings } = useAuth();',
  'const { user, getToken, userProfile, settings, oauthToken, signInWithGoogle } = useAuth();'
);

fs.writeFileSync('src/components/Tutor.tsx', content);
console.log('patched Tutor');
