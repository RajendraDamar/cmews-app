import React from 'react';
import { View } from 'react-native';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Separator } from '~/components/ui/separator';
import { WeatherIcon } from './weather-icon';
import { PrecipitationIcon } from './precipitation-icon';
import { COLORS } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';

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
  const { colorScheme } = useTheme();

  // Calculate temperature range for gradient bars
  const allTemps = forecast.flatMap((f) => [f.tempLow, f.tempHigh]);
  const minTemp = allTemps.length > 0 ? Math.min(...allTemps) : 20;
  const maxTemp = allTemps.length > 0 ? Math.max(...allTemps) : 32;
  const tempRange = maxTemp - minTemp;
  const safeRange = tempRange > 0 ? tempRange : 1;

  const getGradientWidth = (low: number, high: number) => {
    const lowPercent = ((low - minTemp) / safeRange) * 100;
    const highPercent = ((high - minTemp) / safeRange) * 100;
    const width = Math.max(highPercent - lowPercent, 12);
    return { start: Math.min(lowPercent, 100 - width), width };
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>Prakiraan 7 Hari</CardTitle>
      </CardHeader>
      <CardContent className="gap-1.5 px-4 pb-4 pt-1">
        {forecast.map((item, index) => {
          const gradient = getGradientWidth(item.tempLow, item.tempHigh);
          const dateObj = new Date(item.date);
          const dateStr = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

          return (
            <View key={index}>
              <View className="flex-row items-center py-2.5">
                {/* Day & Date */}
                <View className="w-16 shrink-0">
                  <Text className="font-medium">{item.day}</Text>
                  <Text size="sm" variant="muted" className="text-xs">
                    {dateStr}
                  </Text>
                </View>

                {/* Weather Icon */}
                <View className="w-10 items-center justify-center shrink-0">
                  <WeatherIcon condition={item.weather} size={28} />
                </View>

                {/* Precipitation */}
                <View className="w-12 items-center justify-center shrink-0">
                  <PrecipitationIcon percentage={item.precipitation} showPercentage />
                </View>

                {/* Temperature Range Bar */}
                <View className="flex-1 flex-row items-center justify-end gap-1.5 pl-1">
                  <Text size="sm" variant="muted" className="w-7 text-right">
                    {item.tempLow}°
                  </Text>
                  <View className="flex-1 min-w-[32px] max-w-[80px]">
                    <View
                      className="h-1 w-full rounded-full bg-muted"
                      style={{
                        backgroundColor:
                          colorScheme === 'dark'
                            ? 'hsl(217.2 32.6% 17.5%)'
                            : 'hsl(210 40% 96.1%)',
                      }}
                    />
                    <View
                      className="absolute h-1 rounded-full"
                      style={{
                        left: `${gradient.start}%`,
                        width: `${gradient.width}%`,
                        backgroundColor: COLORS.chart.temperature,
                      }}
                    />
                  </View>
                  <Text size="sm" className="w-7 text-left font-medium">
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
