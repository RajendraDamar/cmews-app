import '../global.css';

import { Stack } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';
import { ThemeProvider, useTheme } from '~/lib/theme-provider';
import { View, Platform } from 'react-native';
import { useEffect } from 'react';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(auth)',
};

function ThemedApp() {
  const { colorScheme } = useTheme();

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Update the root HTML element class for web
      if (typeof document !== 'undefined') {
        if (colorScheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }
  }, [colorScheme]);

  return (
    <View className={`flex-1 ${colorScheme === 'dark' ? 'dark' : ''}`}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
          },
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="settings" options={{ headerShown: true }} />
        <Stack.Screen name="privacy" options={{ headerShown: true }} />
      </Stack>
      <PortalHost />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}
