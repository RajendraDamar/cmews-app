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
import { getThemeColor } from '~/lib/constants';

const navItems = [
  { path: '/(tabs)', icon: Home, label: 'Home' },
  { path: '/(tabs)/forecast', icon: CloudRain, label: 'Forecast' },
  { path: '/(tabs)/maps', icon: Map, label: 'Maps' },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { colorScheme, setTheme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const themeColors = getThemeColor(colorScheme === 'dark');

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
        className={`h-full border-r border-border bg-card ${collapsed ? 'w-16' : 'w-64'}`}>
        {/* Logo & Collapse Button */}
        <View
          className={`h-14 flex-row items-center justify-between border-b border-border px-4 ${collapsed ? 'px-2' : ''}`}>
          <View className="flex-row items-center gap-2">
            <Cloud size={28} color={themeColors.foreground} />
            {!collapsed && <Text className="text-lg font-semibold text-foreground">CMEWS</Text>}
          </View>
          <Pressable
            onPress={() => setCollapsed(!collapsed)}
            className="rounded-md p-1.5 active:bg-accent">
            {collapsed ? (
              <ChevronRight size={18} color={themeColors.mutedForeground} />
            ) : (
              <ChevronLeft size={18} color={themeColors.mutedForeground} />
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
                  color={active ? themeColors.foreground : themeColors.mutedForeground}
                />
                {!collapsed && (
                  <Text
                    className={`text-sm ${active ? 'font-medium text-foreground' : 'font-normal text-muted-foreground'}`}>
                    {item.label}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Bottom Section */}
        <View className="border-t border-border px-3 py-2">
          {/* Theme Toggle */}
          <Pressable
            onPress={toggleTheme}
            className="mb-1 flex-row items-center gap-3 rounded-md px-3 py-2 active:bg-accent">
            {colorScheme === 'dark' ? (
              <Moon size={20} color={themeColors.mutedForeground} />
            ) : (
              <Sun size={20} color={themeColors.mutedForeground} />
            )}
            {!collapsed && (
              <Text className="text-sm text-muted-foreground">
                {colorScheme === 'dark' ? 'Dark' : 'Light'}
              </Text>
            )}
          </Pressable>

          {/* Settings */}
          <Pressable
            onPress={() => router.push('/settings')}
            className="mb-1 flex-row items-center gap-3 rounded-md px-3 py-2 active:bg-accent">
            <Settings size={20} color={themeColors.mutedForeground} />
            {!collapsed && (
              <Text className="text-sm text-muted-foreground">Settings</Text>
            )}
          </Pressable>

          <Separator className="my-2" />

          {/* Profile */}
          <ProfileModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            trigger={
              <Pressable
                onPress={() => setModalVisible(true)}
                className="flex-row items-center gap-3 rounded-md px-3 py-2 active:bg-accent">
                <User size={20} color={themeColors.mutedForeground} />
                {!collapsed && (
                  <Text className="text-sm text-muted-foreground">Profile</Text>
                )}
              </Pressable>
            }
          />
        </View>
      </View>
    </>
  );
}
