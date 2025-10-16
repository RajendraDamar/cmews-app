import React from 'react';
import { View } from 'react-native';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Separator } from '~/components/ui/separator';
import { WeatherIcon } from './weather-icon';
import { PrecipitationIcon } from './precipitation-icon';
import { useTheme } from '~/lib/theme-provider';
import { COLORS } from '~/lib/constants';

interface DailyForecastItem {
  day: string;
  date: string;
  weather: string;
  tempHigh: number;
  tempLow: number;
  precipitation: number;
}

interface DailyForecastCardProps {
  forecast: DailyForecastItem[];
}

export function DailyForecastCard({ forecast }: DailyForecastCardProps) {
  // Calculate temperature range for gradient bars
  const allTemps = forecast.flatMap((f) => [f.tempLow, f.tempHigh]);
  const minTemp = Math.min(...allTemps);
  const maxTemp = Math.max(...allTemps);
  const tempRange = maxTemp - minTemp;

  const getGradientWidth = (low: number, high: number) => {
    const lowPercent = ((low - minTemp) / tempRange) * 100;
    const highPercent = ((high - minTemp) / tempRange) * 100;
    return { start: lowPercent, width: highPercent - lowPercent };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prakiraan 7 Hari</CardTitle>
      </CardHeader>
      <CardContent className="gap-2">
        {forecast.map((item, index) => {
          const gradient = getGradientWidth(item.tempLow, item.tempHigh);
          const dateObj = new Date(item.date);
          const dateStr = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

          return (
            <View key={index}>
              <View className="flex-row items-center py-2">
                {/* Day */}
                <View className="w-20">
                  <Text className="font-medium">{item.day}</Text>
                  <Text size="sm" variant="muted">
                    {dateStr}
                  </Text>
                </View>

                {/* Weather Icon */}
                <View className="w-12 items-center">
                  <WeatherIcon condition={item.weather} size={32} />
                </View>

                {/* Precipitation */}
                <View className="w-16 items-center">
                  <PrecipitationIcon percentage={item.precipitation} showPercentage />
                </View>

                {/* Temperature Range */}
                <View className="flex-1 flex-row items-center justify-end gap-2">
                  <Text size="sm" variant="muted" className="w-8 text-right">
                    {item.tempLow}°
                  </Text>
                  <View className="w-24">
                    <View className="h-1 w-full rounded-full bg-muted" />
                    <View
                      className="absolute h-1 rounded-full"
                      style={{
                        left: `${gradient.start}%`,
                        width: `${gradient.width}%`,
                        backgroundColor: COLORS.chart.temperature,
                      }}
                    />
                  </View>
                  <Text size="sm" className="w-8">
                    {item.tempHigh}°
                  </Text>
                </View>
              </View>
              {index < forecast.length - 1 && <Separator />}
            </View>
          );
        })}
      </CardContent>
    </Card>
  );
}
