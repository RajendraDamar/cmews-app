import React from 'react';
import { View } from 'react-native';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { WeatherIcon } from '~/components/weather/weather-icon';
import { getIndonesianDayName, formatIndonesianDateShort } from '~/lib/utils/indonesian-locale';


interface CurrentWeatherCardProps {
  temperature: number;
  feelsLike: number;
  weatherCode: string;
  weatherDescription: string;
  location: string;
  date: Date;
}

export function CurrentWeatherCard({
  temperature,
  feelsLike,
  weatherCode,
  weatherDescription,
  location,
  date,
}: CurrentWeatherCardProps) {
  // Use shared WeatherIcon component for consistent theme-aware icon rendering
  const iconCondition = weatherDescription;

  const dayName = getIndonesianDayName(date);
  const dateStr = formatIndonesianDateShort(date);

  return (
    <Card className="mx-4 mt-2">
      <CardHeader className="pb-3">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text className="text-6xl font-bold">{temperature}°</Text>
            <Text className="mt-2 text-xl">{weatherDescription}</Text>
            <Text variant="muted" className="mt-1">
              Terasa seperti {feelsLike}°
            </Text>
          </View>
          <View className="items-center pt-2">
            <WeatherIcon condition={iconCondition} size={80} />
          </View>
        </View>
      </CardHeader>
      <CardContent className="pt-0">
        <View className="flex-row items-center justify-between border-t border-border pt-3">
          <Text variant="muted">{location}</Text>
          <Text variant="muted">
            {dayName}, {dateStr}
          </Text>
        </View>
      </CardContent>
    </Card>
  );
}
