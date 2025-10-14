import { Tabs } from 'expo-router';
import { View, Pressable } from 'react-native';
import { Home, CloudRain, Map, User, Cloud } from 'lucide-react-native';
import { useState } from 'react';
import { ProfileModal } from '~/components/profile-modal';
import { useTheme } from '~/lib/theme-provider';
import { useBreakpoint } from '~/lib/breakpoints';
import { Sidebar } from '~/components/navigation/sidebar';
import { getThemeColors } from '~/lib/theme';

function ProfileButton() {
  const [modalVisible, setModalVisible] = useState(false);
  const { colorScheme } = useTheme();
  const { isDesktop } = useBreakpoint();
  const colors = getThemeColors(colorScheme);

  const trigger = (
    <Pressable onPress={() => setModalVisible(true)} className="mr-4">
      <User
        size={24}
        color={colors.mutedForeground}
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
  const colors = getThemeColors(colorScheme);
  return (
    <View className="ml-4">
      <Cloud
        size={24}
        color={colors.primary}
      />
    </View>
  );
}

export default function TabLayout() {
  const { colorScheme } = useTheme();
  const { isDesktop } = useBreakpoint();
  const colors = getThemeColors(colorScheme);

  if (isDesktop) {
    // Desktop: Use vertical sidebar layout
    return (
      <View className="flex-1 flex-row">
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
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.primary,
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
