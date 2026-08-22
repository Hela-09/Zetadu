const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

// 1. Remove theme from interface
code = code.replace(`  theme: "light" | "dark" | "system";\n`, ``);

// 2. Remove theme from default settings
code = code.replace(`  theme: 'system',\n`, ``);

// 3. Remove localStorage init
const initTheme = `  const [settings, setSettings] = useState<UserSettings>(() => {
    const localTheme = localStorage.getItem('educore_theme') as UserSettings['theme'];
    return { ...defaultSettings, theme: localTheme || defaultSettings.theme };
  });`;
const newInit = `  const [settings, setSettings] = useState<UserSettings>(defaultSettings);`;
code = code.replace(initTheme, newInit);

// 4. Remove handleStorage theme sync
const storageEvent = `    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'educore_theme' && e.newValue) {
        setSettings(prev => ({ ...prev, theme: e.newValue as UserSettings['theme'] }));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);`;
code = code.replace(storageEvent, ``);

// 5. Remove loadedSettings localStorage set
const loadedSettingsSet = `              if (loadedSettings.theme) {
                localStorage.setItem('educore_theme', loadedSettings.theme);
              }`;
code = code.replace(loadedSettingsSet, ``);

// 6. Remove initial setDoc with theme
code = code.replace(`{ uid: currentUser.uid, theme: 'system' }`, `{ uid: currentUser.uid }`);

// 7. Remove updateSettings localStorage logic
const updateSettingsLogic = `    if (newSettings.theme) {
      localStorage.setItem('educore_theme', newSettings.theme);
    }`;
code = code.replace(updateSettingsLogic, ``);

fs.writeFileSync('src/contexts/AuthContext.tsx', code);
console.log('patched AuthContext.tsx');
