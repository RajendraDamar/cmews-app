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
        // More readable, higher-contrast blue theme on home hero card
        // Dark: deep indigo-blue with slight opacity; Light: richer sky tone for good contrast
        colorScheme === 'dark' ? 'bg-sky-950/95' : 'bg-sky-700'
      )}>
      <CardContent className="p-6">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text className="text-5xl font-bold md:text-6xl text-white">{temperature}°</Text>
            <Text className="mt-3 text-xl text-white/90">{weather}</Text>
            <Text className="mt-2 text-sm text-white/80">
              {location.kecamatan}, {location.kota}
            </Text>
            <Text className="mt-1 text-sm text-white/70">{location.provinsi}</Text>
          </View>
          <View className="items-center">
            <View className="rounded-full p-2 bg-white/10">
              <WeatherIcon condition={weather} size={80} />
            </View>
          </View>
        </View>

        {/* divider: use a subtle light divider so it shows on the colored background */}
        <View
          className="mt-4 pt-3"
          style={{ borderTopWidth: 1, borderTopColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.12)' }}>
          <Text size="sm" className="text-white/60">Diperbarui {lastUpdate}</Text>
        </View>
      </CardContent>
    </Card>
  );
}
