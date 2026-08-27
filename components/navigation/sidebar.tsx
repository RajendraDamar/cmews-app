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
import { NAV_COLORS } from '~/lib/constants';
import { useState } from 'react';
import { ProfileModal } from '~/components/navigation/profile-modal';
import { Separator } from '~/components/ui/separator';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/forecast', icon: CloudRain, label: 'Forecast' },
  { path: '/maps', icon: Map, label: 'Maps' },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { colorScheme, setTheme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [headerHovered, setHeaderHovered] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/index';
    }
    return pathname.includes(path);
  };

  const toggleTheme = () => {
    setTheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <View
        className={`h-full flex-shrink-0 border-r web:transition-all web:duration-300 web:ease-in-out ${
          collapsed ? 'w-16' : 'w-64'
        }`}
        style={{
          flexShrink: 0,
          zIndex: 50,
          backgroundColor: colorScheme === 'dark' ? NAV_COLORS.darkBg : NAV_COLORS.lightBg,
          borderColor: colorScheme === 'dark' ? NAV_COLORS.darkBorder : NAV_COLORS.lightBorder,
        }}>
        {/* Header (Logo + Collapse Button) */}
        <View
          className={`h-14 flex-row items-center border-b web:transition-all web:duration-300 ${
            collapsed ? 'justify-center px-0' : 'justify-between px-4'
          }`}
          style={{
            borderColor:
              colorScheme === 'dark' ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(214.3 31.8% 91.4%)',
          }}>
          {collapsed ? (
            <Pressable
              onPress={() => {
                setCollapsed(false);
                setHeaderHovered(false);
              }}
              onHoverIn={() => setHeaderHovered(true)}
              onHoverOut={() => setHeaderHovered(false)}
              className="h-10 w-10 items-center justify-center rounded-lg web:hover:bg-muted active:bg-muted/80 active:opacity-80 web:transition-all"
              accessibilityLabel="Perluas sidebar"
              accessibilityRole="button">
              {headerHovered ? (
                <ChevronRight
                  size={22}
                  color={colorScheme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(222.2 47.4% 11.2%)'}
                />
              ) : (
                <Cloud
                  size={24}
                  color={colorScheme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(222.2 47.4% 11.2%)'}
                />
              )}
            </Pressable>
          ) : (
            <>
              {/* Logo & Title */}
              <View className="flex-row items-center gap-2.5 overflow-hidden">
                <View className="h-7 w-7 items-center justify-center shrink-0">
                  <Cloud
                    size={24}
                    color={colorScheme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(222.2 47.4% 11.2%)'}
                  />
                </View>
                <Text className="text-lg font-bold tracking-tight">CMEWS</Text>
              </View>

              {/* Collapse Button */}
              <Pressable
                onPress={() => setCollapsed(true)}
                className="items-center justify-center rounded-lg p-2 web:hover:bg-muted active:bg-muted/80 active:opacity-80 web:transition-colors"
                accessibilityLabel="Ciutkan sidebar"
                accessibilityRole="button">
                <ChevronLeft
                  size={18}
                  color={colorScheme === 'dark' ? 'hsl(215 20.2% 65.1%)' : 'hsl(215.4 16.3% 46.9%)'}
                />
              </Pressable>
            </>
          )}
        </View>

        {/* Navigation Items */}
        <View className={`flex-1 py-3 ${collapsed ? 'px-2' : 'px-3'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Pressable
                key={item.path}
                onPress={() => router.replace(item.path as any)}
                className={`relative mb-1.5 flex-row items-center rounded-lg py-2.5 web:transition-all web:duration-200 ${
                  collapsed
                    ? 'h-10 w-10 mx-auto justify-center px-0'
                    : 'px-3 gap-3 web:hover:translate-x-1'
                } ${
                  active
                    ? 'bg-secondary font-medium shadow-sm'
                    : 'web:hover:bg-muted/60'
                } active:scale-[0.98]`}>
                {/* Active Indicator Accent */}
                {active && (
                  <View
                    className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary"
                  />
                )}

                {/* Fixed Invariant Icon Container */}
                <View className="h-5 w-5 items-center justify-center shrink-0">
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
                </View>

                {/* Text Label */}
                {!collapsed && (
                  <Text
                    className={`text-sm whitespace-nowrap ${
                      active ? 'font-semibold' : 'font-normal'
                    }`}
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
          className={`border-t py-2.5 ${collapsed ? 'px-2' : 'px-3'}`}
          style={{
            borderColor:
              colorScheme === 'dark' ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(214.3 31.8% 91.4%)',
          }}>
          {/* Theme Toggle */}
          <Pressable
            onPress={toggleTheme}
            className={`flex-row items-center rounded-lg py-2.5 web:hover:bg-muted active:bg-muted/80 web:transition-colors ${
              collapsed ? 'h-10 w-10 mx-auto justify-center px-0' : 'px-3 gap-3'
            }`}
            accessibilityLabel="Ganti tema"
            accessibilityRole="button">
            <View className="h-5 w-5 items-center justify-center shrink-0">
              {colorScheme === 'dark' ? (
                <Moon size={20} color="hsl(215 20.2% 65.1%)" />
              ) : (
                <Sun size={20} color="hsl(215.4 16.3% 46.9%)" />
              )}
            </View>
            {!collapsed && (
              <Text
                className="text-sm whitespace-nowrap"
                style={{
                  color:
                    colorScheme === 'dark'
                      ? 'hsl(215 20.2% 65.1%)'
                      : 'hsl(215.4 16.3% 46.9%)',
                }}>
                {colorScheme === 'dark' ? 'Dark' : 'Light'}
              </Text>
            )}
          </Pressable>

          <Separator className="my-1.5" />

          {/* Settings */}
          <Pressable
            onPress={() => router.push('/settings')}
            className={`flex-row items-center rounded-lg py-2.5 web:hover:bg-muted active:bg-muted/80 web:transition-colors ${
              collapsed ? 'h-10 w-10 mx-auto justify-center px-0' : 'px-3 gap-3'
            }`}
            accessibilityLabel="Pengaturan"
            accessibilityRole="button">
            <View className="h-5 w-5 items-center justify-center shrink-0">
              <Settings
                size={20}
                color={colorScheme === 'dark' ? 'hsl(215 20.2% 65.1%)' : 'hsl(215.4 16.3% 46.9%)'}
              />
            </View>
            {!collapsed && (
              <Text
                className="text-sm whitespace-nowrap"
                style={{
                  color:
                    colorScheme === 'dark'
                      ? 'hsl(215 20.2% 65.1%)'
                      : 'hsl(215.4 16.3% 46.9%)',
                }}>
                Settings
              </Text>
            )}
          </Pressable>

          <Separator className="my-1.5" />

          {/* Profile */}
          <ProfileModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            trigger={
              <Pressable
                onPress={() => setModalVisible(true)}
                className={`flex-row items-center rounded-lg py-2.5 web:hover:bg-muted active:bg-muted/80 web:transition-colors ${
                  collapsed ? 'h-10 w-10 mx-auto justify-center px-0' : 'px-3 gap-3'
                }`}>
                <View className="h-5 w-5 items-center justify-center shrink-0">
                  <User
                    size={20}
                    color={
                      colorScheme === 'dark'
                        ? 'hsl(215 20.2% 65.1%)'
                        : 'hsl(215.4 16.3% 46.9%)'
                    }
                  />
                </View>
                {!collapsed && (
                  <Text
                    className="text-sm whitespace-nowrap"
                    style={{
                      color:
                        colorScheme === 'dark'
                          ? 'hsl(215 20.2% 65.1%)'
                          : 'hsl(215.4 16.3% 46.9%)',
                    }}>
                    Profile
                  </Text>
                )}
              </Pressable>
            }
          />
        </View>
      </View>
    </>
  );
}
