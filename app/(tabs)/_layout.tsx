import { Tabs } from 'expo-router';
import { View, Pressable } from 'react-native';
import { Home, CloudRain, Map, User, Cloud } from 'lucide-react-native';
import { useState } from 'react';
import { ProfileModal } from '~/components/profile-modal';
import { useTheme } from '~/lib/theme-provider';
import { useBreakpoint } from '~/lib/breakpoints';
import { Sidebar } from '~/components/navigation/sidebar';
import { getThemeColor } from '~/lib/constants';

function ProfileButton() {
  const [modalVisible, setModalVisible] = useState(false);
  const { colorScheme } = useTheme();
  const { isDesktop } = useBreakpoint();
  const themeColors = getThemeColor(colorScheme === 'dark');

  const trigger = (
    <Pressable onPress={() => setModalVisible(true)} className="mr-4">
      <User
        size={24}
        color={themeColors.foreground}
      />
    </Pressable>
  );

  // Always show the button, but on desktop use it as popover trigger
  if (isDesktop) {
    return (
      <ProfileModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        trigger={trigger}
      />
    );
  }

  // On mobile, show button and use modal
  return (
    <>
      {trigger}
      <ProfileModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
}

function LogoHeader() {
  const { colorScheme } = useTheme();
  const themeColors = getThemeColor(colorScheme === 'dark');
  return (
    <View className="ml-4">
      <Cloud
        size={24}
        color={themeColors.foreground}
      />
    </View>
  );
}

export default function TabLayout() {
  const { colorScheme } = useTheme();
  const { isDesktop } = useBreakpoint();
  const themeColors = getThemeColor(colorScheme === 'dark');

  if (isDesktop) {
    // Desktop: Use vertical sidebar layout
    return (
      <View className="flex-1 flex-row bg-background">
        <Sidebar />
        <View className="flex-1">
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: { display: 'none' },
            }}>
            <Tabs.Screen name="index" />
            <Tabs.Screen name="forecast" />
            <Tabs.Screen name="maps" />
          </Tabs>
        </View>
      </View>
    );
  }

  // Mobile/Tablet: Use bottom tabs
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.foreground,
        tabBarInactiveTintColor: themeColors.mutedForeground,
        tabBarStyle: {
          backgroundColor: themeColors.card,
          borderTopColor: themeColors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: themeColors.card,
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: themeColors.foreground,
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
  );
}
