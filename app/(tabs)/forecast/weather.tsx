import { ScrollView, View } from 'react-native';
import { useState } from 'react';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { TimeframeSelector } from '~/components/forecast/timeframe-selector';
import { getWeatherData } from '~/lib/data/maritime-mock';
import type { Timeframe } from '~/lib/types/maritime';
import { CloudRain, Droplets, Sun, Cloud } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';

export default function WeatherTab() {
  const { colorScheme } = useTheme();
  const [timeframe, setTimeframe] = useState<Timeframe>('24h');
  const weatherData = getWeatherData(timeframe);

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <TimeframeSelector selected={timeframe} onSelect={setTimeframe} />

        <View className="mb-4">
          <Text className="mb-3 text-lg font-semibold">Tren Suhu</Text>
          <Card>
            <CardContent className="p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Sun size={24} color={colorScheme === 'dark' ? '#60a5fa' : '#3b82f6'} />
                  <View>
                    <Text variant="muted" size="sm">
                      Suhu Rata-rata
                    </Text>
                    <Text className="text-2xl font-bold">
                      {Math.round(
                        weatherData.reduce((acc, d) => acc + d.temperature, 0) / weatherData.length
                      )}
                      °C
                    </Text>
                  </View>
                </View>
                <View>
                  <Text variant="muted" size="sm" className="text-right">
                    Rentang
                  </Text>
                  <Text className="font-semibold">
                    {Math.min(...weatherData.map((d) => d.temperature))}° -{' '}
                    {Math.max(...weatherData.map((d) => d.temperature))}°
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>

        <View className="mb-4">
          <Text className="mb-3 text-lg font-semibold">
            Prakiraan {timeframe === '24h' ? '24 Jam' : timeframe === '3d' ? '3 Hari' : '7 Hari'}
          </Text>
          <View className="gap-3">
            {weatherData.map((data, index) => {
              const date = new Date(data.datetime);
              const timeStr = date.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
              });
              const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

              return (
                <Card key={index}>
                  <CardContent className="p-4">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="font-semibold">{dateStr}</Text>
                        <Text variant="muted" size="sm">
                          {timeStr}
                        </Text>
                        <Text variant="muted" size="sm" className="mt-1">
                          {data.condition}
                        </Text>
                      </View>

                      <View className="flex-row items-center gap-6">
                        <View className="items-center">
                          <Cloud size={28} color={colorScheme === 'dark' ? '#60a5fa' : '#3b82f6'} />
                          <Text className="mt-1 text-xl font-bold">{data.temperature}°</Text>
                        </View>

                        <View className="gap-2">
                          <View className="flex-row items-center gap-2">
                            <Droplets size={14} color={colorScheme === 'dark' ? '#999' : '#666'} />
                            <Text variant="muted" size="sm">
                              {data.humidity}%
                            </Text>
                          </View>
                          <View className="flex-row items-center gap-2">
                            <CloudRain size={14} color={colorScheme === 'dark' ? '#999' : '#666'} />
                            <Text variant="muted" size="sm">
                              {data.precipitation}%
                            </Text>
                          </View>
                          {data.uvIndex > 0 && (
                            <View className="flex-row items-center gap-2">
                              <Sun size={14} color={colorScheme === 'dark' ? '#999' : '#666'} />
                              <Text variant="muted" size="sm">
                                UV {data.uvIndex}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
