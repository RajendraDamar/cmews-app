import React from 'react';
import { Modal, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings, Shield, HelpCircle, LogOut, Moon, Sun } from 'lucide-react-native';
import { Text } from '~/components/ui/text';
import { Card, CardContent } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { Popover, PopoverTrigger, PopoverContent } from '~/components/ui/popover';
import { useTheme } from '~/lib/theme-provider';
import { useBreakpoint } from '~/lib/breakpoints';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  trigger?: React.ReactNode;
}

export function ProfileModal({ visible, onClose, trigger }: ProfileModalProps) {
  const router = useRouter();
  const { colorScheme, setTheme } = useTheme();
  const { isDesktop } = useBreakpoint();

  const handleNavigation = (route: any) => {
    onClose();
    router.push(route);
  };

  const toggleTheme = () => {
    setTheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  const menuItems = [
    {
      icon: Settings,
      label: 'Pengaturan',
      onPress: () => handleNavigation('/settings'),
    },
    {
      icon: Shield,
      label: 'Privasi',
      onPress: () => handleNavigation('/privacy'),
    },
    {
      icon: HelpCircle,
      label: 'Bantuan & Dukungan',
      onPress: () => {},
    },
    {
      icon: LogOut,
      label: 'Keluar',
      onPress: () => handleNavigation('/(auth)/login'),
      danger: true,
    },
  ];

  const ProfileContent = () => (
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
              <Text className="text-sm">Tema</Text>
            </View>
            <Text variant="muted" size="sm">
              {colorScheme === 'dark' ? 'Dark' : 'Light'}
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
  );

  // Desktop: Use Popover
  if (isDesktop && trigger) {
    return (
      <Popover>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent side="right" align="start" className="p-0">
          <ProfileContent />
        </PopoverContent>
      </Popover>
    );
  }

  // Mobile: Use Modal
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
            <ProfileContent />
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
