import React from 'react';
import { View, ScrollView } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { WeatherIcon } from '~/components/weather/weather-icon';
import { parseBMKGDateTime, formatTime24 } from '~/lib/utils/indonesian-locale';
import type { BMKGHourlyData } from '~/lib/types/weather';
import { useTheme } from '~/lib/theme-provider';
import { Droplets } from 'lucide-react-native';
import { getThemeColor } from '~/lib/constants';

interface HourlyForecastProps {
  hourlyData: BMKGHourlyData[];
}

export function HourlyForecast({ hourlyData }: HourlyForecastProps) {
  const { colorScheme } = useTheme();
  const themeColors = getThemeColor(colorScheme === 'dark');

  return (
    <View className="px-4">
      <Text className="mb-3 text-lg font-semibold">Prakiraan Per Jam</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
        contentContainerStyle={{ gap: 12 }}>
        {hourlyData.map((hour, index) => {
          const time = parseBMKGDateTime(hour.datetime);
          return (
            <Card key={index} className="w-24">
              <CardContent className="items-center p-3">
                <Text className="mb-2 text-sm" variant="muted">
                  {formatTime24(time)}
                </Text>
                <WeatherIcon condition={hour.weather.description} size={32} />
                <Text className="mt-2 text-lg font-semibold">{hour.temperature}°</Text>
                <View className="mt-1 flex-row items-center gap-1">
                  <Droplets size={12} color={themeColors.muted} />
                  <Text variant="muted" size="sm">
                    {hour.humidity}%
                  </Text>
                </View>
              </CardContent>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}
