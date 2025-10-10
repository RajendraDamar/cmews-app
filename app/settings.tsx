import { Stack, useRouter } from 'expo-router';
import { View, Text, Switch, Pressable } from 'react-native';
import { Moon, Bell, Lock, LogOut, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { useTheme } from '~/lib/theme-provider';

function SettingRow({ icon, label, trailing, onPress }: any) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center border-b border-border px-4 py-4">
      {icon}
      <Text className="ml-3 flex-1 text-foreground">{label}</Text>
      {trailing}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  const iconColor = colorScheme === 'dark' ? 'hsl(215 20.2% 65.1%)' : 'hsl(215.4 16.3% 46.9%)';

  return (
    <>
      <Stack.Screen options={{ title: 'Settings' }} />
      <View className="flex-1 bg-background">
        <View className="px-4 py-6">
          <Text className="mb-6 text-2xl font-bold text-foreground">Settings</Text>

          <View className="rounded-lg bg-card">
            <SettingRow
              icon={<Moon size={20} color={iconColor} />}
              label="Dark Mode"
              trailing={<Switch value={darkMode} onValueChange={setDarkMode} />}
            />

            <SettingRow
              icon={<Bell size={20} color={iconColor} />}
              label="Notifications"
              trailing={<Switch value={notifications} onValueChange={setNotifications} />}
            />

            <SettingRow
              icon={<Lock size={20} color={iconColor} />}
              label="Privacy"
              trailing={<ChevronRight size={20} color={iconColor} />}
              onPress={() => router.push('/privacy')}
            />

            <SettingRow
              icon={<LogOut size={20} color={iconColor} />}
              label="Sign Out"
              trailing={<ChevronRight size={20} color={iconColor} />}
              onPress={() => router.replace('/(auth)/login')}
            />
          </View>
        </View>
      </View>
    </>
  );
}
