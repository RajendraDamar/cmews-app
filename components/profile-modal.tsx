import React from 'react';
import { Modal, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings, Shield, HelpCircle, LogOut, Moon, Sun } from 'lucide-react-native';
import { Text } from '~/components/ui/text';
import { Card, CardContent } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { useTheme } from '~/lib/theme-provider';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ProfileModal({ visible, onClose }: ProfileModalProps) {
  const router = useRouter();
  const { theme, setTheme, colorScheme } = useTheme();

  const handleNavigation = (route: string) => {
    onClose();
    router.push(route);
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeLabel = () => {
    if (theme === 'system') return `System (${colorScheme})`;
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  };

  const menuItems = [
    {
      icon: Settings,
      label: 'Settings',
      onPress: () => handleNavigation('/settings'),
    },
    {
      icon: Shield,
      label: 'Privacy',
      onPress: () => handleNavigation('/privacy'),
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      onPress: () => {},
    },
    {
      icon: LogOut,
      label: 'Sign Out',
      onPress: () => handleNavigation('/(auth)/login'),
      danger: true,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <Pressable className="flex-1 bg-black/50" onPress={onClose}>
        <View className="flex-1 items-end justify-start pr-4 pt-16">
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Card className="w-72">
              <CardContent className="p-0">
                {/* Profile Header */}
                <View className="items-center gap-2 p-6">
                  <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
                    <Text className="text-2xl font-bold text-primary-foreground">JD</Text>
                  </View>
                  <Text className="text-lg font-semibold">John Doe</Text>
                  <Text variant="muted" size="sm">
                    john.doe@example.com
                  </Text>
                </View>

                <Separator />

                {/* Theme Toggle */}
                <View className="px-6 py-3">
                  <Pressable
                    className="flex-row items-center justify-between active:opacity-70"
                    onPress={toggleTheme}>
                    <View className="flex-row items-center gap-3">
                      {colorScheme === 'dark' ? (
                        <Moon size={20} color="hsl(215 20.2% 65.1%)" />
                      ) : (
                        <Sun size={20} color="hsl(215.4 16.3% 46.9%)" />
                      )}
                      <Text className="text-sm">Theme</Text>
                    </View>
                    <Text variant="muted" size="sm">
                      {getThemeLabel()}
                    </Text>
                  </Pressable>
                </View>

                <Separator />

                {/* Menu Items */}
                <View className="py-2">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <React.Fragment key={item.label}>
                        <Pressable
                          className="flex-row items-center gap-3 px-6 py-3 active:bg-muted"
                          onPress={item.onPress}>
                          <Icon
                            size={20}
                            color={
                              item.danger
                                ? 'hsl(0 84.2% 60.2%)'
                                : colorScheme === 'dark'
                                  ? 'hsl(215 20.2% 65.1%)'
                                  : 'hsl(215.4 16.3% 46.9%)'
                            }
                          />
                          <Text
                            className={`flex-1 text-sm ${item.danger ? 'text-destructive' : 'text-foreground'}`}>
                            {item.label}
                          </Text>
                        </Pressable>
                        {index < menuItems.length - 1 && <Separator />}
                      </React.Fragment>
                    );
                  })}
                </View>
              </CardContent>
            </Card>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
