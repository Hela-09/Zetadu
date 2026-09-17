import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const defaultThemeContextValue: ThemeContextType = {
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultThemeContextValue);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('zetadu_theme') as Theme | null;
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          return stored;
        }
      } catch (_) {}
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('zetadu_theme');
        if (stored === 'light' || stored === 'dark') return stored;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark';
        }
      } catch (_) {}
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    const applyTheme = () => {
      let isDark = false;
      if (theme === 'dark') {
        isDark = true;
      } else if (theme === 'light') {
        isDark = false;
      } else {
        isDark = mediaQuery ? mediaQuery.matches : false;
      }

      setResolvedTheme(isDark ? 'dark' : 'light');

      if (isDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    applyTheme();

    if (!mediaQuery) return;

    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('zetadu_theme', newTheme);
      }
    } catch (_) {}
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  const contextValue = useMemo<ThemeContextType>(() => ({
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  }), [theme, resolvedTheme, setTheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    return defaultThemeContextValue;
  }
  return context;
}

export default ThemeProvider;
