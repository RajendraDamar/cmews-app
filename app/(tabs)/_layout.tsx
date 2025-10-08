import { Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ProfileModal } from '~/components/profile-modal';
import { useTheme } from '~/lib/theme-provider';

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

export default function TabLayout() {
  const { colorScheme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
        },
        headerRight: () => <ProfileButton />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Games',
          tabBarIcon: ({ color }) => <Ionicons name="game-controller" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="books"
        options={{
          title: 'Books',
          tabBarIcon: ({ color }) => <Ionicons name="book" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="maps"
        options={{
          title: 'Maps',
          tabBarIcon: ({ color }) => <Ionicons name="map" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
