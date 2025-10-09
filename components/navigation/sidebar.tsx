import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { Text } from '~/components/ui/text';
import { useTheme } from '~/lib/theme-provider';
import { useState } from 'react';
import { ProfileModal } from '~/components/profile-modal';

const navItems = [
  { path: '/(tabs)', icon: 'home', label: 'Home' },
  { path: '/(tabs)/forecast', icon: 'partly-sunny', label: 'Forecast' },
  { path: '/(tabs)/maps', icon: 'map', label: 'Maps' },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { colorScheme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const isActive = (path: string) => {
    if (path === '/(tabs)') {
      return pathname === '/(tabs)' || pathname === '/';
    }
    return pathname.includes(path.replace('/(tabs)', ''));
  };

  return (
    <>
      <View
        className="h-full w-64 border-r"
        style={{
          backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
          borderColor: colorScheme === 'dark' ? '#333' : '#e5e5e5',
        }}>
        {/* Logo */}
        <View className="h-16 items-center justify-center border-b px-4">
          <Text className="text-xl font-bold">CMEWS</Text>
        </View>

        {/* Navigation Items */}
        <View className="flex-1 py-4">
          {navItems.map((item) => (
            <Pressable
              key={item.path}
              onPress={() => router.push(item.path as any)}
              className={`mx-2 mb-1 flex-row items-center gap-3 rounded-lg px-4 py-3 ${
                isActive(item.path) ? 'bg-accent' : ''
              }`}>
              <Ionicons
                name={item.icon as any}
                size={24}
                color={
                  isActive(item.path)
                    ? colorScheme === 'dark'
                      ? '#fff'
                      : '#000'
                    : colorScheme === 'dark'
                      ? '#999'
                      : '#666'
                }
              />
              <Text
                className={`text-base ${isActive(item.path) ? 'font-semibold' : 'font-normal'}`}
                style={{
                  color: isActive(item.path)
                    ? colorScheme === 'dark'
                      ? '#fff'
                      : '#000'
                    : colorScheme === 'dark'
                      ? '#999'
                      : '#666',
                }}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Profile Button at Bottom */}
        <View className="border-t p-4">
          <Pressable
            onPress={() => setModalVisible(true)}
            className="flex-row items-center gap-3 rounded-lg px-4 py-3 active:bg-accent">
            <Ionicons
              name="person-circle-outline"
              size={24}
              color={colorScheme === 'dark' ? '#999' : '#666'}
            />
            <Text className="text-base" style={{ color: colorScheme === 'dark' ? '#999' : '#666' }}>
              Profile
            </Text>
          </Pressable>
        </View>
      </View>
      <ProfileModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
}
