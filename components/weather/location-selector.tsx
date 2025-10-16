import React from 'react';
import { View, Pressable } from 'react-native';
import { MapPin, RefreshCw } from 'lucide-react-native';
import { Text } from '~/components/ui/text';
import { useTheme } from '~/lib/theme-provider';
import { getThemeColor } from '~/lib/constants';

interface LocationSelectorProps {
  provinsi: string;
  kota: string;
  kecamatan: string;
  lastUpdated: string;
  onRefresh: () => void;
  onLocationPress: () => void;
}

export function LocationSelector({
  provinsi,
  kota,
  kecamatan,
  lastUpdated,
  onRefresh,
  onLocationPress,
}: LocationSelectorProps) {
  const { colorScheme } = useTheme();
  const themeColors = getThemeColor(colorScheme === 'dark');

  return (
    <View className="flex-row items-center justify-between px-4 pb-3 pt-4">
      <Pressable
        onPress={onLocationPress}
        className="flex-1 flex-row items-center gap-2"
        accessibilityLabel="Pilih lokasi">
        <MapPin size={20} color={themeColors.primary} />
        <View className="flex-1">
          <Text className="font-semibold">{kecamatan}</Text>
          <Text variant="muted" size="sm">
            {kota}, {provinsi}
          </Text>
        </View>
      </Pressable>

      <View className="items-end gap-1">
        <Pressable
          onPress={onRefresh}
          className="rounded-full p-2"
          accessibilityLabel="Perbarui cuaca">
          <RefreshCw size={20} color={themeColors.primary} />
        </Pressable>
        <Text variant="muted" size="sm">
          {lastUpdated}
        </Text>
      </View>
    </View>
  );
}
