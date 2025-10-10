import React from 'react';
import { View } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { getWeatherIcon } from '~/lib/utils/weather-icons';
import { parseBMKGDateTime, getIndonesianDayName } from '~/lib/utils/indonesian-locale';
import type { BMKGDailyData } from '~/lib/types/weather';
import { useTheme } from '~/lib/theme-provider';
import { CloudRain } from 'lucide-react-native';

interface DailyForecastProps {
  dailyData: BMKGDailyData[];
}

export function DailyForecast({ dailyData }: DailyForecastProps) {
  const { colorScheme } = useTheme();

  return (
    <View className="px-4 pb-6">
      <Text className="mb-3 text-lg font-semibold">Prakiraan 7 Hari</Text>
      <View className="gap-3">
        {dailyData.map((day, index) => {
          const date = parseBMKGDateTime(day.date + '0000');
          const dayName = index === 0 ? 'Hari Ini' : getIndonesianDayName(date);
          const iconInfo = getWeatherIcon(day.weather.code);
          const WeatherIcon = iconInfo.icon;
          const iconColor = colorScheme === 'dark' ? iconInfo.color.dark : iconInfo.color.light;

          return (
            <Card key={index}>
              <CardContent className="flex-row items-center justify-between p-4">
                <View className="flex-1">
                  <Text className="font-semibold">{dayName}</Text>
                  <Text variant="muted" size="sm">
                    {day.weather.description}
                  </Text>
                </View>

                <View className="flex-row items-center gap-4">
                  {day.precipitation !== undefined && day.precipitation > 0 && (
                    <View className="flex-row items-center gap-1">
                      <CloudRain size={14} color={colorScheme === 'dark' ? '#60a5fa' : '#3b82f6'} />
                      <Text variant="muted" size="sm">
                        {day.precipitation}%
                      </Text>
                    </View>
                  )}

                  <WeatherIcon size={32} color={iconColor} />

                  <View className="min-w-[60px] items-end">
                    <Text className="font-semibold">{day.tempMax}°</Text>
                    <Text variant="muted" size="sm">
                      {day.tempMin}°
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          );
        })}
      </View>
    </View>
  );
}
