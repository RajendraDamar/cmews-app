import { Stack, useRouter } from 'expo-router';
import { View, Text, Switch, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

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
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <>
      <Stack.Screen options={{ title: 'Settings' }} />
      <View className="flex-1 bg-background">
        <View className="px-4 py-6">
          <Text className="mb-6 text-2xl font-bold text-foreground">Settings</Text>

          <View className="rounded-lg bg-card">
            <SettingRow
              icon={<Ionicons name="moon" size={20} color="#666" />}
              label="Dark Mode"
              trailing={<Switch value={darkMode} onValueChange={setDarkMode} />}
            />

            <SettingRow
              icon={<Ionicons name="notifications" size={20} color="#666" />}
              label="Notifications"
              trailing={<Switch value={notifications} onValueChange={setNotifications} />}
            />

            <SettingRow
              icon={<Ionicons name="lock-closed" size={20} color="#666" />}
              label="Privacy"
              trailing={<Ionicons name="chevron-forward" size={20} color="#666" />}
              onPress={() => router.push('/privacy')}
            />

            <SettingRow
              icon={<Ionicons name="log-out" size={20} color="#666" />}
              label="Sign Out"
              trailing={<Ionicons name="chevron-forward" size={20} color="#666" />}
              onPress={() => router.replace('/(auth)/login')}
            />
          </View>
        </View>
      </View>
    </>
  );
}
