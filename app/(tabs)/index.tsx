import { ScrollView, View } from 'react-native';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '~/components/ui';
import { Text } from '~/components/ui/text';
import { MOCK_TODAY_WEATHER, MOCK_HOURLY_FORECAST } from '~/constants/mock-data';
import { CloudRain, Droplets, Wind, Sun, Eye } from 'lucide-react-native';
import { Stack } from 'expo-router';
import { useTheme } from '~/lib/theme-provider';
import { useState, useEffect } from 'react';

export default function Home() {
  const { colorScheme } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Today' }} />
      <ScrollView className="flex-1 bg-background">
        {loading ? (
          // Skeleton Loading State
          <>
            <Card className="m-4 mt-6">
              <CardHeader>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Skeleton className="mb-2 h-10 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </View>
                  <Skeleton className="h-16 w-16 rounded-full" />
                </View>
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-2 h-6 w-40" />
                <View className="flex-row gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </View>
              </CardContent>
            </Card>

            <View className="px-4">
              <Skeleton className="mb-3 h-6 w-32" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-4"
                contentContainerStyle={{ gap: 12 }}>
                {[1, 2, 3, 4].map((_, index) => (
                  <Card key={index} className="w-24">
                    <CardContent className="items-center p-3">
                      <Skeleton className="mb-2 h-4 w-12" />
                      <Skeleton className="mb-2 h-8 w-8 rounded-full" />
                      <Skeleton className="mb-1 h-5 w-10" />
                      <Skeleton className="h-3 w-12" />
                    </CardContent>
                  </Card>
                ))}
              </ScrollView>
            </View>

            <View className="px-4 pb-6">
              <Skeleton className="mb-3 h-6 w-20" />
              <View className="flex-row flex-wrap gap-3">
                {[1, 2, 3, 4].map((_, index) => (
                  <Card key={index} className="min-w-[45%] flex-1">
                    <CardContent className="p-4">
                      <Skeleton className="mb-2 h-5 w-20" />
                      <Skeleton className="h-8 w-16" />
                    </CardContent>
                  </Card>
                ))}
              </View>
            </View>
          </>
        ) : (
          // Actual Content
          <>
            <Card className="m-4 mt-6">
              <CardHeader>
                <View className="flex-row items-center justify-between">
                  <View>
                    <CardTitle className="text-3xl">{MOCK_TODAY_WEATHER.currentTemp}°</CardTitle>
                    <CardDescription className="text-base">
                      {MOCK_TODAY_WEATHER.location}
                    </CardDescription>
                  </View>
                  <CloudRain size={64} color={colorScheme === 'dark' ? '#60a5fa' : '#3b82f6'} />
                </View>
              </CardHeader>
              <CardContent>
                <Text className="mb-2 text-lg">{MOCK_TODAY_WEATHER.condition}</Text>
                <View className="flex-row gap-4">
                  <Text variant="muted">H: {MOCK_TODAY_WEATHER.high}°</Text>
                  <Text variant="muted">L: {MOCK_TODAY_WEATHER.low}°</Text>
                  <Text variant="muted">Feels like {MOCK_TODAY_WEATHER.feelsLike}°</Text>
                </View>
              </CardContent>
            </Card>

            {/* Hourly Forecast */}
            <View className="px-4">
              <Text className="mb-3 text-lg font-semibold">Hourly Forecast</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-4"
                contentContainerStyle={{ gap: 12 }}>
                {MOCK_HOURLY_FORECAST.map((hour, index) => (
                  <Card key={index} className="w-24">
                    <CardContent className="items-center p-3">
                      <Text className="mb-2 text-sm" variant="muted">
                        {hour.time}
                      </Text>
                      <CloudRain size={32} color={colorScheme === 'dark' ? '#60a5fa' : '#3b82f6'} />
                      <Text className="mt-2 text-lg font-semibold">{hour.temp}°</Text>
                      <View className="mt-1 flex-row items-center gap-1">
                        <Droplets size={12} color={colorScheme === 'dark' ? '#999' : '#666'} />
                        <Text variant="muted" size="sm">
                          {hour.precipitation}%
                        </Text>
                      </View>
                    </CardContent>
                  </Card>
                ))}
              </ScrollView>
            </View>

            {/* Weather Details */}
            <View className="px-4 pb-6">
              <Text className="mb-3 text-lg font-semibold">Details</Text>
              <View className="flex-row flex-wrap gap-3">
                <Card className="min-w-[45%] flex-1">
                  <CardContent className="p-4">
                    <View className="flex-row items-center gap-2">
                      <Droplets size={20} color={colorScheme === 'dark' ? '#60a5fa' : '#3b82f6'} />
                      <Text variant="muted">Humidity</Text>
                    </View>
                    <Text className="mt-2 text-2xl font-semibold">
                      {MOCK_TODAY_WEATHER.humidity}%
                    </Text>
                  </CardContent>
                </Card>

                <Card className="min-w-[45%] flex-1">
                  <CardContent className="p-4">
                    <View className="flex-row items-center gap-2">
                      <Wind size={20} color={colorScheme === 'dark' ? '#60a5fa' : '#3b82f6'} />
                      <Text variant="muted">Wind</Text>
                    </View>
                    <Text className="mt-2 text-2xl font-semibold">
                      {MOCK_TODAY_WEATHER.windSpeed} km/h
                    </Text>
                  </CardContent>
                </Card>

                <Card className="min-w-[45%] flex-1">
                  <CardContent className="p-4">
                    <View className="flex-row items-center gap-2">
                      <Sun size={20} color={colorScheme === 'dark' ? '#60a5fa' : '#3b82f6'} />
                      <Text variant="muted">UV Index</Text>
                    </View>
                    <Text className="mt-2 text-2xl font-semibold">
                      {MOCK_TODAY_WEATHER.uvIndex}
                    </Text>
                  </CardContent>
                </Card>

                <Card className="min-w-[45%] flex-1">
                  <CardContent className="p-4">
                    <View className="flex-row items-center gap-2">
                      <Eye size={20} color={colorScheme === 'dark' ? '#60a5fa' : '#3b82f6'} />
                      <Text variant="muted">Visibility</Text>
                    </View>
                    <Text className="mt-2 text-2xl font-semibold">
                      {MOCK_TODAY_WEATHER.visibility} km
                    </Text>
                  </CardContent>
                </Card>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
}
