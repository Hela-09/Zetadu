const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  "console.log('App.tsx check:', { uid: user?.uid, isSuperAdmin, isSubscriptionActive, userProfileRole: userProfile?.role });\n  if (user && userProfile && !isSuperAdmin && !userProfile.isSuperAdmin && userProfile.role !== 'super_admin' && !isSubscriptionActive) {",
  "if (user && userProfile && !isSuperAdmin && !userProfile.isSuperAdmin && userProfile.role !== 'super_admin' && !isSubscriptionActive) {"
);
fs.writeFileSync('src/App.tsx', code);
console.log('Cleaned App.tsx log');
