const fs = require('fs');

let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

// Ensure Briefcase icon is imported
if (!code.includes('Briefcase')) {
    code = code.replace("import { Home, BookOpen, MessageSquare, User, Download }", "import { Home, BookOpen, MessageSquare, User, Download, Briefcase }");
}

code = code.replace(
    /const navItems = \[[\s\S]*?\];/, 
    `const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'subjects', label: 'Learn', icon: BookOpen },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'profile', label: 'Profile', icon: User },
  ];`
);

fs.writeFileSync('src/components/Sidebar.tsx', code);

let bottomCode = fs.readFileSync('src/components/BottomNav.tsx', 'utf8');

if (!bottomCode.includes('Briefcase')) {
    bottomCode = bottomCode.replace("import { Home, BookOpen, User }", "import { Home, BookOpen, User, Briefcase }");
}

bottomCode = bottomCode.replace(
    /const navItems = \[[\s\S]*?\];/, 
    `const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'subjects', label: 'Learn', icon: BookOpen },
    { id: 'opportunities', label: 'Opp\\s', icon: Briefcase },
    { id: 'profile', label: 'Profile', icon: User },
  ];`
);

fs.writeFileSync('src/components/BottomNav.tsx', bottomCode);
