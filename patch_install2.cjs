const fs = require('fs');
let content = fs.readFileSync('src/components/Profile.tsx', 'utf8');

const stateUpdate = `
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };
`;

content = content.replace(
  'const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);',
  'const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);\n' + stateUpdate
);

fs.writeFileSync('src/components/Profile.tsx', content);
console.log('Added states to Profile.tsx');
