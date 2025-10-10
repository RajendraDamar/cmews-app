import { Tabs } from 'expo-router';
import { View, Pressable } from 'react-native';
import { Home, CloudRain, Map, User, Cloud } from 'lucide-react-native';
import { useState } from 'react';
import { ProfileModal } from '~/components/profile-modal';
import { useTheme } from '~/lib/theme-provider';
import { useBreakpoint } from '~/lib/breakpoints';
import { Sidebar } from '~/components/navigation/sidebar';

function ProfileButton() {
  const [modalVisible, setModalVisible] = useState(false);
  const { colorScheme } = useTheme();
  const { isDesktop } = useBreakpoint();

  const trigger = (
    <Pressable onPress={() => setModalVisible(true)} className="mr-4">
      <User
        size={24}
        color={colorScheme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(215.4 16.3% 46.9%)'}
      />
    </Pressable>
  );

  return (
    <ProfileModal
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      trigger={isDesktop ? trigger : undefined}
    />
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
  const { isDesktop } = useBreakpoint();

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
        tabBarActiveTintColor:
          colorScheme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(222.2 47.4% 11.2%)',
        tabBarInactiveTintColor:
          colorScheme === 'dark' ? 'hsl(215 20.2% 65.1%)' : 'hsl(215.4 16.3% 46.9%)',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)',
          borderTopColor:
            colorScheme === 'dark' ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(214.3 31.8% 91.4%)',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)',
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colorScheme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(222.2 47.4% 11.2%)',
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
