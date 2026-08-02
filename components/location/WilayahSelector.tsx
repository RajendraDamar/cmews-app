// Wilayah Selector Component
// Provides UI for selecting Indonesian cities or auto-detecting location

import * as React from 'react';
import { View, Pressable, ActivityIndicator, Alert, Platform } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Text } from '~/components/ui/text';
import { Select, SelectContent, SelectItem } from '~/components/ui/select';
import { cn } from '~/lib/utils';
import { useTheme } from '~/lib/theme-provider';
import { locationService } from '~/lib/services/LocationService';
import { WILAYAH_CODES } from '~/lib/data/wilayah-mapping';

interface WilayahSelectorProps {
  selectedWilayah: string;
  onWilayahChange: (wilayahCode: string) => void;
  className?: string;
  showLocationButton?: boolean;
}

export function WilayahSelector({
  selectedWilayah,
  onWilayahChange,
  className,
  showLocationButton = true,
}: WilayahSelectorProps) {
  const { colorScheme } = useTheme();
  const [isLoadingLocation, setIsLoadingLocation] = React.useState(false);

  // Convert wilayah code to city name for display
  const getSelectedCityName = (): string => {
    const entry = Object.entries(WILAYAH_CODES).find(([, code]) => code === selectedWilayah);
    return entry ? entry[0] : 'Jakarta Pusat';
  };

  const handleAutoDetectLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const location = await locationService.getCurrentLocation();
      const nearestCode = await locationService.getNearestWilayahCode(
        location.latitude,
        location.longitude
      );
      onWilayahChange(nearestCode);

      // Show success message
      if (Platform.OS === 'web') {
        alert('Lokasi terdeteksi: ' + getSelectedCityName());
      } else {
        Alert.alert('Lokasi Terdeteksi', `Wilayah: ${getSelectedCityName()}`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Gagal mendeteksi lokasi';

      if (Platform.OS === 'web') {
        alert(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setIsLoadingLocation(false);
    }
  };

  return (
    <View className={cn('gap-2', className)}>
      <View className="flex-row items-center gap-2">
        <View className="flex-1">
          <Select
            value={selectedWilayah}
            onValueChange={onWilayahChange}
            placeholder="Pilih Wilayah">
            <SelectContent>
              {Object.entries(WILAYAH_CODES).map(([cityName, code]) => (
                <SelectItem key={code} value={code}>
                  {cityName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </View>

        {showLocationButton && (
          <Pressable
            onPress={handleAutoDetectLocation}
            disabled={isLoadingLocation}
            className={cn(
              'h-10 w-10 items-center justify-center rounded-md border border-input bg-background',
              isLoadingLocation && 'opacity-50'
            )}>
            {isLoadingLocation ? (
              <ActivityIndicator
                size="small"
                color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'}
              />
            ) : (
              <MapPin size={18} color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} />
            )}
          </Pressable>
        )}
      </View>

      <Text className="text-xs text-muted-foreground">
        {showLocationButton
          ? 'Pilih wilayah atau gunakan lokasi otomatis'
          : 'Pilih wilayah Indonesia'}
      </Text>
    </View>
  );
}
