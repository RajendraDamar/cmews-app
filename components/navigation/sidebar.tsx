import { View, Pressable } from 'react-native';
import {
  Home,
  CloudRain,
  Map,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  Moon,
  Sun,
  Cloud,
} from 'lucide-react-native';
import { useRouter, usePathname } from 'expo-router';
import { Text } from '~/components/ui/text';
import { useTheme } from '~/lib/theme-provider';
import { useState } from 'react';
import { ProfileModal } from '~/components/profile-modal';
import { Separator } from '~/components/ui/separator';

const navItems = [
  { path: '/(tabs)', icon: Home, label: 'Home' },
  { path: '/(tabs)/forecast', icon: CloudRain, label: 'Forecast' },
  { path: '/(tabs)/maps', icon: Map, label: 'Maps' },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { colorScheme, theme, setTheme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    if (path === '/(tabs)') {
      return pathname === '/(tabs)' || pathname === '/';
    }
    return pathname.includes(path.replace('/(tabs)', ''));
  };

  const toggleTheme = () => {
    setTheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <View
        className={`h-full border-r ${collapsed ? 'w-16' : 'w-64'}`}
        style={{
          backgroundColor: colorScheme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)',
          borderColor: colorScheme === 'dark' ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(214.3 31.8% 91.4%)',
        }}>
        {/* Logo & Collapse Button */}
        <View
          className={`h-14 flex-row items-center justify-between border-b px-4 ${collapsed ? 'px-2' : ''}`}
          style={{
            borderColor:
              colorScheme === 'dark' ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(214.3 31.8% 91.4%)',
          }}>
          {!collapsed && (
            <View className="flex-row items-center gap-2">
              <Cloud
                size={24}
                color={colorScheme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(222.2 47.4% 11.2%)'}
              />
              <Text className="text-lg font-semibold">CMEWS</Text>
            </View>
          )}
          <Pressable
            onPress={() => setCollapsed(!collapsed)}
            className="rounded-md p-1.5 active:bg-accent">
            {collapsed ? (
              <ChevronRight
                size={18}
                color={colorScheme === 'dark' ? 'hsl(215 20.2% 65.1%)' : 'hsl(215.4 16.3% 46.9%)'}
              />
            ) : (
              <ChevronLeft
                size={18}
                color={colorScheme === 'dark' ? 'hsl(215 20.2% 65.1%)' : 'hsl(215.4 16.3% 46.9%)'}
              />
            )}
          </Pressable>
        </View>

        {/* Navigation Items */}
        <View className="flex-1 px-3 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Pressable
                key={item.path}
                onPress={() => router.push(item.path as any)}
                className={`mb-1 flex-row items-center gap-3 rounded-md px-3 py-2 ${
                  active ? 'bg-secondary' : ''
                } active:bg-accent`}>
                <Icon
                  size={20}
                  color={
                    active
                      ? colorScheme === 'dark'
                        ? 'hsl(210 40% 98%)'
                        : 'hsl(222.2 47.4% 11.2%)'
                      : colorScheme === 'dark'
                        ? 'hsl(215 20.2% 65.1%)'
                        : 'hsl(215.4 16.3% 46.9%)'
                  }
                />
                {!collapsed && (
                  <Text
                    className={`text-sm ${active ? 'font-medium' : 'font-normal'}`}
                    style={{
                      color: active
                        ? colorScheme === 'dark'
                          ? 'hsl(210 40% 98%)'
                          : 'hsl(222.2 47.4% 11.2%)'
                        : colorScheme === 'dark'
                          ? 'hsl(215 20.2% 65.1%)'
                          : 'hsl(215.4 16.3% 46.9%)',
                    }}>
                    {item.label}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Bottom Section */}
        <View
          className="border-t px-3 py-2"
          style={{
            borderColor:
              colorScheme === 'dark' ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(214.3 31.8% 91.4%)',
          }}>
          {/* Theme Toggle */}
          <Pressable
            onPress={toggleTheme}
            className="mb-1 flex-row items-center gap-3 rounded-md px-3 py-2 active:bg-accent">
            {colorScheme === 'dark' ? (
              <Moon size={20} color="hsl(215 20.2% 65.1%)" />
            ) : (
              <Sun size={20} color="hsl(215.4 16.3% 46.9%)" />
            )}
            {!collapsed && (
              <Text
                className="text-sm"
                style={{
                  color: colorScheme === 'dark' ? 'hsl(215 20.2% 65.1%)' : 'hsl(215.4 16.3% 46.9%)',
                }}>
                {colorScheme === 'dark' ? 'Dark' : 'Light'}
              </Text>
            )}
          </Pressable>

          {/* Settings */}
          <Pressable
            onPress={() => router.push('/settings')}
            className="mb-1 flex-row items-center gap-3 rounded-md px-3 py-2 active:bg-accent">
            <Settings
              size={20}
              color={colorScheme === 'dark' ? 'hsl(215 20.2% 65.1%)' : 'hsl(215.4 16.3% 46.9%)'}
            />
            {!collapsed && (
              <Text
                className="text-sm"
                style={{
                  color: colorScheme === 'dark' ? 'hsl(215 20.2% 65.1%)' : 'hsl(215.4 16.3% 46.9%)',
                }}>
                Settings
              </Text>
            )}
          </Pressable>

          <Separator className="my-2" />

          {/* Profile */}
          <Pressable
            onPress={() => setModalVisible(true)}
            className="flex-row items-center gap-3 rounded-md px-3 py-2 active:bg-accent">
            <User
              size={20}
              color={colorScheme === 'dark' ? 'hsl(215 20.2% 65.1%)' : 'hsl(215.4 16.3% 46.9%)'}
            />
            {!collapsed && (
              <Text
                className="text-sm"
                style={{
                  color: colorScheme === 'dark' ? 'hsl(215 20.2% 65.1%)' : 'hsl(215.4 16.3% 46.9%)',
                }}>
                Profile
              </Text>
            )}
          </Pressable>
        </View>
      </View>
      <ProfileModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
}
