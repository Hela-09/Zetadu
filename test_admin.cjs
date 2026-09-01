const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  "if (user && userProfile && !isSuperAdmin && !isSubscriptionActive) {",
  "console.log('App.tsx check:', { uid: user?.uid, isSuperAdmin, isSubscriptionActive, userProfileRole: userProfile?.role });\n  if (user && userProfile && !isSuperAdmin && !isSubscriptionActive) {"
);
fs.writeFileSync('src/App.tsx', code);
