import { Tabs } from 'expo-router';
import { View, Pressable } from 'react-native';
import { Home, CloudRain, Map, User, Cloud } from 'lucide-react-native';
import { useState, useCallback } from 'react';
import { ProfileModal } from '~/components/profile-modal';
import { useTheme } from '~/lib/theme-provider';
import { Sidebar } from '~/components/navigation/sidebar';
import { useBreakpoint } from '~/lib/breakpoints';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const { isDesktop } = useBreakpoint();
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const renderHeaderRight = useCallback(() => (
    <Pressable
      onPress={() => setProfileModalVisible(true)}
      className="mr-4 p-1 active:opacity-70"
      hitSlop={8}
      accessibilityLabel="Menu Profil"
      accessibilityRole="button">
      <User
        size={24}
        color={colorScheme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(215.4 16.3% 46.9%)'}
      />
    </Pressable>
  ), [colorScheme]);

  return (
    <View
      className={colorScheme === 'dark' ? 'dark flex-1 bg-background' : 'flex-1 bg-background'}
      style={{
        flex: 1,
        backgroundColor: colorScheme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)',
        flexDirection: isDesktop ? 'row' : 'column',
      }}>
      {/* Left sidebar — only mounted on desktop web viewports */}
      {isDesktop && <Sidebar />}

      {/* Main content area */}
      <View
        className={colorScheme === 'dark' ? 'dark flex-1' : 'flex-1'}
        style={{
          flex: 1,
          backgroundColor: colorScheme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)',
        }}>
        <Tabs
          tabBar={isDesktop ? () => null : undefined}
          screenOptions={{
            headerShown: !isDesktop,
            sceneStyle: {
              backgroundColor:
                colorScheme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)',
            },
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
              height: 60 + (isDesktop ? 0 : insets.bottom),
              paddingBottom: 8 + (isDesktop ? 0 : insets.bottom),
              paddingTop: 8,
              elevation: 8,
              zIndex: 50,
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
            headerRight: renderHeaderRight,
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

      {/* Root-level Profile Modal for Mobile */}
      {!isDesktop && (
        <ProfileModal
          visible={profileModalVisible}
          onClose={() => setProfileModalVisible(false)}
        />
      )}
    </View>
  );
}
