const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importStatement = "import CompleteProfile from './components/CompleteProfile';\nimport PaymentGate from './components/PaymentGate';";
if (!code.includes('PaymentGate')) {
    code = code.replace("import CompleteProfile from './components/CompleteProfile';", importStatement);
}

const loginCheck = `  if (!user) {
    return <Login />;
  }

  if (user && userProfile && !userProfile.username) {
    return <CompleteProfile />;
  }`;

const newLoginCheck = `  if (!user) {
    return <Login />;
  }

  if (user && userProfile && !userProfile.username) {
    return <CompleteProfile />;
  }

  // Check subscription status
  const isSubscriptionActive = userProfile?.subscriptionStatus === 'active';
  if (user && userProfile && !isSuperAdmin && !isSubscriptionActive) {
    return <PaymentGate />;
  }`;

if (code.includes(loginCheck) && !code.includes('<PaymentGate />')) {
    code = code.replace(loginCheck, newLoginCheck);
    fs.writeFileSync('src/App.tsx', code);
    console.log("App.tsx patched");
} else {
    console.log("Could not patch App.tsx");
}
