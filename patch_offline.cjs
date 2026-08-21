const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('offline-banner')) {
  let offlineBanner = `
        {!navigator.onLine && (
          <div className="offline-banner absolute top-0 left-0 right-0 bg-amber-500 text-white text-center py-1 text-xs font-medium z-[100] flex justify-center items-center gap-2">
            You're offline. Reconnect to continue.
          </div>
        )}
`;

  content = content.replace(
    '<main className={`flex-1 flex flex-col',
    offlineBanner + '\n        <main className={`flex-1 flex flex-col'
  );

  // Add the state to listen for online/offline events
  const stateUpdate = `
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
`;
  
  content = content.replace(
    'const [adminChecked, setAdminChecked] = useState(false);',
    'const [adminChecked, setAdminChecked] = useState(false);\n' + stateUpdate
  );

  // Re-replace !navigator.onLine to !isOnline in the banner we just added
  content = content.replace('!navigator.onLine', '!isOnline');

  fs.writeFileSync('src/App.tsx', content);
  console.log('Patched App.tsx with offline banner');
}
