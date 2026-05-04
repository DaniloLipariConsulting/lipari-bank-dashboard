import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // inizializzazione da localStorage
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('liparibank-theme') as Theme) || 'light'
  );

  // funzione toggle (corretta con useCallback)
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('liparibank-theme', next);
      return next;
    });
  }, []);

  // 🔥 qui applichiamo il tema al BODY (fix definitivo)
  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  // memo del value
  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme,
      isDark: theme === 'dark',
    }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// hook custom
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve essere usato dentro ThemeProvider');
  }
  return context;
};