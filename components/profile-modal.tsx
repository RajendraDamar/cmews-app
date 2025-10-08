import React from 'react';
import { Modal, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
      icon: 'settings-outline' as const,
      label: 'Settings',
      onPress: () => handleNavigation('/settings'),
    },
    {
      icon: 'shield-checkmark-outline' as const,
      label: 'Privacy',
      onPress: () => handleNavigation('/privacy'),
    },
    {
      icon: 'help-circle-outline' as const,
      label: 'Help & Support',
      onPress: () => {},
    },
    {
      icon: 'log-out-outline' as const,
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
                      <Ionicons
                        name={colorScheme === 'dark' ? 'moon' : 'sunny'}
                        size={24}
                        color="#666"
                      />
                      <Text>Theme</Text>
                    </View>
                    <Text variant="muted" size="sm">
                      {getThemeLabel()}
                    </Text>
                  </Pressable>
                </View>

                <Separator />

                {/* Menu Items */}
                <View className="py-2">
                  {menuItems.map((item, index) => (
                    <React.Fragment key={item.label}>
                      <Pressable
                        className="flex-row items-center gap-3 px-6 py-3 active:bg-muted"
                        onPress={item.onPress}>
                        <Ionicons
                          name={item.icon}
                          size={24}
                          color={item.danger ? '#EF4444' : '#666'}
                        />
                        <Text
                          className={`flex-1 ${item.danger ? 'text-destructive' : 'text-foreground'}`}>
                          {item.label}
                        </Text>
                      </Pressable>
                      {index < menuItems.length - 1 && <Separator />}
                    </React.Fragment>
                  ))}
                </View>
              </CardContent>
            </Card>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
