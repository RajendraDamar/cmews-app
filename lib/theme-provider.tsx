import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, Platform } from 'react-native';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  colorScheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@cmews-app:theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const { colorScheme: nwColorScheme, setColorScheme: setNWColorScheme } = useNativeWindColorScheme();
  const [theme, setThemeState] = useState<Theme>('system');

  // Load saved theme preference
  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((savedTheme) => {
      if (
        savedTheme &&
        (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')
      ) {
        setThemeState(savedTheme as Theme);
      }
    });
  }, []);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  const colorScheme: 'light' | 'dark' = theme === 'system' ? (systemColorScheme ?? 'light') : theme;

  // Sync NativeWind on native and root .dark class on web
  useEffect(() => {
    // Only synchronize NativeWind if colorScheme has diverged
    if (nwColorScheme !== colorScheme) {
      setNWColorScheme(colorScheme);
    }

    // Sync the document root `.dark` class on web so Tailwind CSS variables match JS theme
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const root = document.documentElement;
      if (colorScheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [colorScheme, nwColorScheme, setNWColorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
