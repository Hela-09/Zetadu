import fs from 'fs';

let app = fs.readFileSync('src/App.tsx', 'utf8');

const oldEffect = `  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setSystemDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const darkMode = settings?.theme === 'dark' || (settings?.theme === 'system' && systemDarkMode);`;

const newEffect = `  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setSystemDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const darkMode = settings?.theme === 'dark' || (settings?.theme === 'system' && systemDarkMode);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);`;

app = app.replace(oldEffect, newEffect);

fs.writeFileSync('src/App.tsx', app);
