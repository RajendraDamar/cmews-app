import { Tabs } from 'expo-router';
import { View, Pressable } from 'react-native';
import { Home, CloudRain, Map, User, Cloud } from 'lucide-react-native';
import { useState } from 'react';
import { ProfileModal } from '~/components/profile-modal';
import { useTheme } from '~/lib/theme-provider';
import { Sidebar } from '~/components/navigation/sidebar';
import { useBreakpoint } from '~/lib/breakpoints';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function ProfileButton() {
  const [modalVisible, setModalVisible] = useState(false);
  const { colorScheme } = useTheme();

  return (
    <>
      <Pressable onPress={() => setModalVisible(true)} className="mr-4">
        <User
          size={24}
          color={colorScheme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(215.4 16.3% 46.9%)'}
        />
      </Pressable>
      <ProfileModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
}

function LogoHeader() {
  const { colorScheme } = useTheme();
  return (
    <View className="ml-4">
      <Cloud
        size={24}
        color={colorScheme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(222.2 47.4% 11.2%)'}
      />
    </View>
  );
}

export default function TabLayout() {
  const { colorScheme } = useTheme();
  const insets = useSafeAreaInsets();
  // Single source of truth for responsive breakpoints — matches the same hook
  // used by index.tsx, maps.tsx, and all child screens.
  // No SSR hydration guard needed: output is now "single" (SPA mode).
  const { isDesktop } = useBreakpoint();

  // Desktop: sidebar + content in a row. Mobile: column with bottom tabs.
  // The tab bar is physically unmounted on desktop via tabBar={() => null}.
  return (
    <View
      className="flex-1 bg-background"
      style={{
        flex: 1,
        flexDirection: isDesktop ? 'row' : 'column',
      }}>
      {/* Left sidebar — only mounted on desktop web viewports */}
      {isDesktop && <Sidebar />}

      {/* Main content area */}
      <View
        className="flex-1"
        style={{
          flex: 1,
        }}>
        <Tabs
          // Physical tab bar unmounting on desktop — the tabBar prop completely
          // removes the tab bar component from the DOM tree.
          // DO NOT use tabBarStyle: { display: 'none' } — React Navigation's
          // internal DOM wrappers override CSS display rules on web.
          tabBar={isDesktop ? () => null : undefined}
          screenOptions={{
            headerShown: !isDesktop,
            tabBarActiveTintColor:
              colorScheme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(222.2 47.4% 11.2%)',
            tabBarInactiveTintColor:
              colorScheme === 'dark' ? 'hsl(215 20.2% 65.1%)' : 'hsl(215.4 16.3% 46.9%)',
            tabBarStyle: {
              backgroundColor:
                colorScheme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)',
              borderTopColor:
                colorScheme === 'dark' ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(214.3 31.8% 91.4%)',
              borderTopWidth: 1,
              // Add bottom safe area inset on mobile to prevent gesture bar overlap
              height: 60 + (isDesktop ? 0 : insets.bottom),
              paddingBottom: 8 + (isDesktop ? 0 : insets.bottom),
              paddingTop: 8,
            },
            headerStyle: {
              backgroundColor:
                colorScheme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)',
              borderBottomWidth: 0,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor:
              colorScheme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(222.2 47.4% 11.2%)',
            headerLeft: () => <LogoHeader />,
            headerRight: () => <ProfileButton />,
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <Home size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="forecast"
            options={{
              title: 'Forecast',
              tabBarIcon: ({ color }) => <CloudRain size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="maps"
            options={{
              title: 'Maps',
              headerShown: false,
              tabBarIcon: ({ color }) => <Map size={24} color={color} />,
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}
