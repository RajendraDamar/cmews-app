import React from 'react';
import { View } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { WeatherIcon } from './weather-icon';
import { cn } from '~/lib/utils';
import { useTheme } from '~/lib/theme-provider';

interface HeroCardProps {
  temperature: number;
  weather: string;
  location: {
    kecamatan: string;
    kota: string;
    provinsi: string;
  };
  lastUpdate: string;
}

export function HeroCard({ temperature, weather, location, lastUpdate }: HeroCardProps) {
  const { colorScheme } = useTheme();

  return (
    <Card
      className={cn(
        'mx-4 mt-2 overflow-hidden border-0 shadow-lg md:mx-0',
        // Use blue theme on home hero card for both light and dark modes
        colorScheme === 'dark' ? 'bg-sky-900/95' : 'bg-sky-600'
      )}>
      <CardContent className="p-6">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text className="text-5xl font-bold md:text-6xl">{temperature}°</Text>
            <Text className="mt-3 text-xl">{weather}</Text>
            <Text className="mt-2 text-sm">
              {location.kecamatan}, {location.kota}
            </Text>
            <Text className="mt-1 text-sm">{location.provinsi}</Text>
          </View>
          <View className="items-center">
            <WeatherIcon condition={weather} size={80} />
          </View>
        </View>
  <View className="mt-4 border-t border-border pt-3">
          <Text variant="muted" size="sm">Diperbarui {lastUpdate}</Text>
        </View>
      </CardContent>
    </Card>
  );
}
