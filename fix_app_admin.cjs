const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  "if (user && userProfile && !isSuperAdmin && !isSubscriptionActive) {",
  "if (user && userProfile && !isSuperAdmin && !userProfile.isSuperAdmin && userProfile.role !== 'super_admin' && !isSubscriptionActive) {"
);
fs.writeFileSync('src/App.tsx', code);
console.log('Fixed App.tsx admin check');
