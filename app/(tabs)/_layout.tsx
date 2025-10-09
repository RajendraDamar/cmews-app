import { Tabs } from 'expo-router';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ProfileModal } from '~/components/profile-modal';
import { useTheme } from '~/lib/theme-provider';
import { useBreakpoint } from '~/lib/breakpoints';
import { Sidebar } from '~/components/navigation/sidebar';

function ProfileButton() {
  const [modalVisible, setModalVisible] = useState(false);
  const { colorScheme } = useTheme();
  return (
    <>
      <Pressable onPress={() => setModalVisible(true)} className="mr-4">
        <Ionicons
          name="person-circle-outline"
          size={28}
          color={colorScheme === 'dark' ? '#fff' : '#666'}
        />
      </Pressable>
      <ProfileModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
}

function LogoHeader() {
  return (
    <View className="ml-4">
      <Ionicons name="partly-sunny" size={28} color="#3b82f6" />
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
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
        },
        headerLeft: () => <LogoHeader />,
        headerRight: () => <ProfileButton />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="forecast"
        options={{
          title: 'Forecast',
          tabBarIcon: ({ color }) => <Ionicons name="partly-sunny" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="maps"
        options={{
          title: 'Maps',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="map" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
