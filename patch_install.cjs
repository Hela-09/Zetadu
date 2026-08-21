const fs = require('fs');
let content = fs.readFileSync('src/components/Profile.tsx', 'utf8');

if (!content.includes('deferredPrompt')) {
  // Add the state and event listener
  const stateUpdate = `
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  useEffect(() => {
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
    'const [isEditing, setIsEditing] = useState(false);',
    'const [isEditing, setIsEditing] = useState(false);\n' + stateUpdate
  );

  // Add the Install Button just above the logout button
  const installButton = `
        {deferredPrompt && (
          <button 
            onClick={handleInstallClick}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors w-full justify-center md:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Install EduCore
          </button>
        )}
`;

  content = content.replace(
    '<button \n            onClick={() => setShowLogoutConfirm(true)}',
    installButton + '\n          <button \n            onClick={() => setShowLogoutConfirm(true)}'
  );

  fs.writeFileSync('src/components/Profile.tsx', content);
  console.log('Patched Profile.tsx with install button');
}
