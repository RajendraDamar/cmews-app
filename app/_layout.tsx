import '../global.css';

import { Stack } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';
import { ThemeProvider, useTheme } from '~/lib/theme-provider';
import { View, Platform } from 'react-native';
import { useEffect } from 'react';
import { initializePushNotifications } from '~/lib/notifications/push-service';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

if (Platform.OS === 'web') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('maplibre-gl/dist/maplibre-gl.css');
}

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(auth)',
};

// Child component rendered INSIDE ThemeProvider where useTheme() is safe
function ThemedApp() {
  const { colorScheme } = useTheme();

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      // Update the root HTML element class for web dark mode styling
      if (colorScheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [colorScheme]);

  useEffect(() => {
    initializePushNotifications().catch((error) => {
      console.error('Push notification initialization failed:', error);
    });
  }, []);

  const bgStyle = {
    flex: 1,
    backgroundColor: colorScheme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)',
  };

  return (
    <View
      className={colorScheme === 'dark' ? 'dark flex-1 bg-background' : 'flex-1 bg-background'}
      style={bgStyle}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)',
          },
          headerTintColor: colorScheme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(222.2 47.4% 11.2%)',
          contentStyle: {
            backgroundColor: colorScheme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)',
          },
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

// Outermost RootLayout wrapper - NO useTheme() calls allowed here!
export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      // Belt-and-suspenders: ensure maplibre-gl CSS is in the DOM.
      if (!document.getElementById('maplibre-gl-css') && !document.querySelector('link[href*="maplibre-gl"]')) {
        const link = document.createElement('link');
        link.id = 'maplibre-gl-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css';
        document.head.appendChild(link);
      }
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
