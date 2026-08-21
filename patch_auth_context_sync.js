import fs from 'fs';

let content = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

const syncLogic = `
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'educore_theme' && e.newValue) {
        setSettings(prev => ({ ...prev, theme: e.newValue as UserSettings['theme'] }));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
`;

content = content.replace(
  '  useEffect(() => {\n    const unsubscribe = onAuthStateChanged',
  syncLogic + '    const unsubscribe = onAuthStateChanged'
);

fs.writeFileSync('src/contexts/AuthContext.tsx', content);

