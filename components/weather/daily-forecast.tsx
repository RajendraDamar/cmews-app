import React from 'react';
import { View } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { WeatherIcon } from '~/components/weather/weather-icon';
import { parseBMKGDateTime, getIndonesianDayName } from '~/lib/utils/indonesian-locale';
import type { BMKGDailyData } from '~/lib/types/weather';
import { useTheme } from '~/lib/theme-provider';
import { CloudRain } from 'lucide-react-native';
import { getThemeColor } from '~/lib/constants';

interface DailyForecastProps {
  dailyData: BMKGDailyData[];
}

export function DailyForecast({ dailyData }: DailyForecastProps) {
  const { colorScheme } = useTheme();
  const themeColors = getThemeColor(colorScheme === 'dark');

  return (
    <View className="px-4 pb-6">
      <Text className="mb-3 text-lg font-semibold">Prakiraan 7 Hari</Text>
      <View className="gap-3">
        {dailyData.map((day, index) => {
          const date = parseBMKGDateTime(day.date + '0000');
          const dayName = index === 0 ? 'Hari Ini' : getIndonesianDayName(date);
          
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
                      <CloudRain size={14} color={themeColors.primary} />
                      <Text variant="muted" size="sm">
                        {day.precipitation}%
                      </Text>
                    </View>
                  )}

                  <WeatherIcon condition={day.weather.description} size={32} />

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
