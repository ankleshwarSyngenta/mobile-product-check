import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { defaultTheme } from './defaultTheme';
import type { VerificationTheme } from './types';

interface ThemeProviderProps {
  theme?: Partial<VerificationTheme>;
  children: ReactNode;
}

function mergeTheme(partial?: Partial<VerificationTheme>): VerificationTheme {
  if (!partial) return defaultTheme;
  return {
    ...defaultTheme,
    ...partial,
    colors: { ...defaultTheme.colors, ...(partial.colors || {}) },
    icons: { ...defaultTheme.icons, ...(partial.icons || {}) },
    messages: { ...defaultTheme.messages, ...(partial.messages || {}) },
  };
}

const ThemeContext = createContext<VerificationTheme>(defaultTheme);

export const VerificationThemeProvider: React.FC<ThemeProviderProps> = ({ theme, children }) => {
  const value = useMemo(() => mergeTheme(theme), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useVerificationTheme(): VerificationTheme {
  return useContext(ThemeContext);
}
