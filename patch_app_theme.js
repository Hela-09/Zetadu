import fs from 'fs';

let app = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `  const [darkMode, setDarkMode] = useState(false);`;
const replacement1 = `  const [systemDarkMode, setSystemDarkMode] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setSystemDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const darkMode = settings?.theme === 'dark' || (settings?.theme === 'system' && systemDarkMode);
`;

app = app.replace(target1, replacement1);

const target2 = `  const toggleDarkMode = () => setDarkMode(!darkMode);`;
const replacement2 = `  const toggleDarkMode = () => updateSettings({ theme: darkMode ? 'light' : 'dark' });`;

app = app.replace(target2, replacement2);

fs.writeFileSync('src/App.tsx', app);
