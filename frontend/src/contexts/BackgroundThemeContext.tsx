'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type BgTheme = 'red' | 'blue' | 'mix';

interface BackgroundThemeContextValue {
  theme: BgTheme;
  setTheme: (t: BgTheme) => void;
  cycle: () => void;
}

const BackgroundThemeContext = createContext<BackgroundThemeContextValue | null>(null);

const ORDER: BgTheme[] = ['red', 'blue', 'mix'];

export function BackgroundThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<BgTheme>('red');

  const cycle = () =>
    setTheme(prev => ORDER[(ORDER.indexOf(prev) + 1) % ORDER.length]);

  return (
    <BackgroundThemeContext.Provider value={{ theme, setTheme, cycle }}>
      {children}
    </BackgroundThemeContext.Provider>
  );
}

export function useBackgroundTheme() {
  const ctx = useContext(BackgroundThemeContext);
  if (!ctx) throw new Error('useBackgroundTheme must be used inside BackgroundThemeProvider');
  return ctx;
}
