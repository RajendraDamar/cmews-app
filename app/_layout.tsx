import '../global.css';

import { Stack } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(auth)',
};

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="settings" options={{ headerShown: true }} />
        <Stack.Screen name="privacy" options={{ headerShown: true }} />
      </Stack>
      <PortalHost />
    </>
  );
}
