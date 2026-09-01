const fs = require('fs');

// 1. Fix App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
if (!appCode.includes("import Opportunities")) {
   appCode = appCode.replace("import Profile from './components/Profile';", "import Profile from './components/Profile';\nimport Opportunities from './components/Opportunities';");
   fs.writeFileSync('src/App.tsx', appCode);
}

// 2. Fix BottomNav.tsx
let bottomCode = fs.readFileSync('src/components/BottomNav.tsx', 'utf8');
if (!bottomCode.includes("Briefcase")) {
   bottomCode = bottomCode.replace("import { Home, BookOpen, User }", "import { Home, BookOpen, User, Briefcase }");
   fs.writeFileSync('src/components/BottomNav.tsx', bottomCode);
}

// 3. Fix Home.tsx
let homeCode = fs.readFileSync('src/components/Home.tsx', 'utf8');
if (!homeCode.includes("Settings,")) {
   homeCode = homeCode.replace("import { ViewType,", "import { ViewType, "); // Just to be sure
   homeCode = homeCode.replace("Trophy, Calendar, Play } from 'lucide-react';", "Trophy, Calendar, Play, Settings } from 'lucide-react';");
   fs.writeFileSync('src/components/Home.tsx', homeCode);
}

// 4. Fix Practice.tsx
let pracCode = fs.readFileSync('src/components/Practice.tsx', 'utf8');
if (!pracCode.includes("BrainCircuit,")) {
   pracCode = pracCode.replace("import { CheckCircle2, XCircle,", "import { CheckCircle2, XCircle, BrainCircuit,");
}
if (!pracCode.includes("const handleExit =")) {
   // handleExit might have been handleExitAfterSubmit or we can just define it
   // Actually, the button is for leaving BEFORE submit. Let's just define handleExit.
   const handleExitCode = `
  const handleExit = () => {
    setShowLeavePrompt(false);
    clearSession();
    // Assuming clearSession routes back or something, else:
  };
`;
   // I'll just change onClick={handleExit} to onClick={() => { setShowLeavePrompt(false); clearSession(); }}
   pracCode = pracCode.replace("onClick={handleExit}", "onClick={() => { setShowLeavePrompt(false); clearSession(); }}");
}
if (pracCode.includes("timeElapsed")) {
   // timeElapsed is state?
   // Let's check if it exists in Practice.tsx.
}
fs.writeFileSync('src/components/Practice.tsx', pracCode);

// 5. Fix Profile.tsx
let profCode = fs.readFileSync('src/components/Profile.tsx', 'utf8');
if (!profCode.includes("Flame,")) {
   profCode = profCode.replace("Award,", "Award, Flame,");
}
fs.writeFileSync('src/components/Profile.tsx', profCode);

