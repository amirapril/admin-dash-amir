import { createContext, useContext, useEffect, useState } from 'react';

/**
 * ThemeContext — light / dark mode toggle.
 * Bootstrap 5.3 supports theming via `data-bs-theme` on <html>,
 * so we simply flip that attribute and remember the choice.
 */
const ThemeContext = createContext(null);

const STORAGE_KEY = 'dashboard_theme';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEY) || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
