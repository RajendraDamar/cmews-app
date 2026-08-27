import '../global.css';

import { Stack } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';
import { ThemeProvider, useTheme } from '~/lib/theme-provider';
import { View, Platform } from 'react-native';
import { useEffect } from 'react';
import { initializePushNotifications } from '~/lib/notifications/push-service';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
    initializePushNotifications().catch((error) => {
      console.error('Push notification initialization failed:', error);
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colorScheme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)',
      }}>
      <Stack
        screenOptions={{
          animation: 'slide_from_right',
          animationDuration: 220,
          gestureEnabled: true,
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
        <Stack.Screen name="settings" options={{ headerShown: true, title: 'Pengaturan' }} />
        <Stack.Screen name="privacy" options={{ headerShown: true, title: 'Kebijakan Privasi' }} />
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
    <SafeAreaProvider style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <ThemedApp />
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
