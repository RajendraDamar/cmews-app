import React from 'react';
import { View } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { WeatherIcon } from './weather-icon';
import { cn } from '~/lib/utils';

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
  return (
    <Card
      className={cn(
        'mx-4 mt-2 overflow-hidden border-0 shadow-lg',
        'bg-primary'
      )}>
      <CardContent className="p-6">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text className="text-5xl font-bold text-primary-foreground md:text-6xl">{temperature}°</Text>
            <Text className="mt-3 text-xl text-primary-foreground/90">{weather}</Text>
            <Text className="mt-2 text-sm text-primary-foreground/70">
              {location.kecamatan}, {location.kota}
            </Text>
            <Text className="mt-1 text-sm text-primary-foreground/70">{location.provinsi}</Text>
          </View>
          <View className="items-center">
            <WeatherIcon condition={weather} size={80} />
          </View>
        </View>
        <View className="mt-4 border-t border-primary-foreground/20 pt-3">
          <Text className="text-xs text-primary-foreground/60">Diperbarui {lastUpdate}</Text>
        </View>
      </CardContent>
    </Card>
  );
}
