import React from 'react';
import { View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';
import { Select, SelectContent, SelectItem } from '~/components/ui/select';

interface ForecastLocationSelectorProps {
  selectedLocation: string;
  availableLocations: string[];
  onLocationChange: (location: string) => void;
}

export function ForecastLocationSelector({
  selectedLocation,
  availableLocations,
  onLocationChange,
}: ForecastLocationSelectorProps) {
  const { colorScheme } = useTheme();

  return (
    <View className="px-4 pb-3 pt-4">
      <View className="flex-row items-center gap-2">
        <MapPin size={20} color={colorScheme === 'dark' ? '#60a5fa' : '#3b82f6'} />
        <Select
          value={selectedLocation}
          onValueChange={onLocationChange}
          placeholder="Pilih Lokasi"
          className="flex-1">
          <SelectContent>
            {availableLocations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </View>
    </View>
  );
}
