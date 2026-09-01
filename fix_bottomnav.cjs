const fs = require('fs');

// 1. Fix BottomNav.tsx
let bottomCode = fs.readFileSync('src/components/BottomNav.tsx', 'utf8');
if (!bottomCode.includes("Briefcase")) {
   bottomCode = bottomCode.replace("import { Home, BookOpen, MessageSquare, User }", "import { Home, BookOpen, MessageSquare, User, Briefcase }");
   fs.writeFileSync('src/components/BottomNav.tsx', bottomCode);
}

// 2. Fix App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
if (!appCode.includes("import Opportunities")) {
   appCode = appCode.replace("import Profile from './components/Profile';", "import Profile from './components/Profile';\nimport Opportunities from './components/Opportunities';");
   fs.writeFileSync('src/App.tsx', appCode);
}
