import { Stack, useRouter } from 'expo-router';
import { ScrollView, View, Switch, Pressable } from 'react-native';
import {
  Moon,
  Bell,
  MapPin,
  Thermometer,
  Globe,
  Info,
  ChevronRight,
  Lock,
  LogOut,
} from 'lucide-react-native';
import { useState } from 'react';
import { useTheme } from '~/lib/theme-provider';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Separator } from '~/components/ui/separator';
import { useBreakpoint } from '~/lib/breakpoints';
import { getThemeColor } from '~/lib/constants';

function SettingRow({ icon, label, value, trailing, onPress }: any) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between py-3 active:opacity-70">
      <View className="flex-row items-center gap-3">
        {icon}
        <Text className="text-base">{label}</Text>
      </View>
      {trailing || (value && <Text variant="muted">{value}</Text>)}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { colorScheme, setTheme } = useTheme();
  const { isDesktop } = useBreakpoint();
  const [notifications, setNotifications] = useState(true);
  const [locationPermission, setLocationPermission] = useState(true);

  const themeColors = getThemeColor(colorScheme === 'dark');

  const handleThemeChange = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Pengaturan',
        }} 
      />
      <ScrollView className="flex-1 bg-background">
        <View className={`px-4 py-6 ${isDesktop ? 'mx-auto w-full max-w-3xl' : ''}`}>
          <Text className="mb-6 text-3xl font-bold">Pengaturan</Text>

          {/* Tampilan */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Tampilan</CardTitle>
              <CardDescription>Sesuaikan tampilan aplikasi</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingRow
                icon={<Moon size={20} color={themeColors.muted} />}
                label="Mode Gelap"
                trailing={<Switch value={colorScheme === 'dark'} onValueChange={handleThemeChange} />}
              />
            </CardContent>
          </Card>

          {/* Notifikasi */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Notifikasi</CardTitle>
              <CardDescription>Kelola notifikasi cuaca</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingRow
                icon={<Bell size={20} color={themeColors.muted} />}
                label="Notifikasi Push"
                trailing={<Switch value={notifications} onValueChange={setNotifications} />}
              />
            </CardContent>
          </Card>

          {/* Lokasi */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Lokasi</CardTitle>
              <CardDescription>Pengaturan lokasi</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingRow
                icon={<MapPin size={20} color={themeColors.muted} />}
                label="Izin Lokasi"
                trailing={
                  <Switch value={locationPermission} onValueChange={setLocationPermission} />
                }
              />
            </CardContent>
          </Card>

          {/* Satuan */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Satuan</CardTitle>
              <CardDescription>Satuan pengukuran</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingRow
                icon={<Thermometer size={20} color={themeColors.muted} />}
                label="Suhu"
                value="Celsius (°C)"
                trailing={<ChevronRight size={20} color={themeColors.muted} />}
                onPress={() => {}}
              />
            </CardContent>
          </Card>

          {/* Bahasa */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Bahasa</CardTitle>
              <CardDescription>Pilih bahasa aplikasi</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingRow
                icon={<Globe size={20} color={themeColors.muted} />}
                label="Bahasa"
                value="Indonesia"
                trailing={<ChevronRight size={20} color={themeColors.muted} />}
                onPress={() => {}}
              />
            </CardContent>
          </Card>

          {/* Tentang */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Tentang</CardTitle>
              <CardDescription>Informasi aplikasi</CardDescription>
            </CardHeader>
            <CardContent className="gap-0">
              <SettingRow icon={<Info size={20} color={themeColors.muted} />} label="Versi" value="1.0.0" />
              <Separator />
              <SettingRow
                icon={<Lock size={20} color={themeColors.muted} />}
                label="Privasi"
                trailing={<ChevronRight size={20} color={themeColors.muted} />}
                onPress={() => router.push('/privacy')}
              />
              <Separator />
              <SettingRow
                icon={<LogOut size={20} color={themeColors.muted} />}
                label="Keluar"
                trailing={<ChevronRight size={20} color={themeColors.muted} />}
                onPress={() => router.replace('/(auth)/login')}
              />
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </>
  );
}
