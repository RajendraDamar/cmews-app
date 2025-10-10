import { ScrollView, View } from 'react-native';
import { Skeleton } from '~/components/ui';
import { Text } from '~/components/ui/text';
import { Separator } from '~/components/ui/separator';
import { MOCK_3DAY_FORECAST } from '~/constants/mock-data';
import { Droplets, CloudRain, Wind } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';
import { useState, useEffect } from 'react';

export default function Day3Forecast() {
  const { colorScheme } = useTheme();
  const dayData = MOCK_3DAY_FORECAST[2];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ScrollView className="flex-1 bg-background">
      {loading ? (
        // Skeleton Loading State
        <View className="p-4">
          <Skeleton className="mb-4 h-6 w-32" />
          {[1, 2, 3, 4, 5].map((_, index) => (
            <View key={index}>
              <View className="flex-row items-center justify-between py-4">
                <View className="flex-1">
                  <Skeleton className="mb-2 h-5 w-20" />
                  <View className="flex-row gap-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </View>
                </View>
                <View className="items-center">
                  <Skeleton className="mb-2 h-10 w-10 rounded-full" />
                  <Skeleton className="h-6 w-12" />
                </View>
              </View>
              {index < 4 && <Separator />}
            </View>
          ))}
        </View>
      ) : (
        // Actual Content - List/Table Style
        <View className="p-4">
          <Text className="mb-4 text-xl font-semibold">{dayData.date}</Text>
          {dayData.hourly.map((hour, index) => (
            <View key={index}>
              <View className="flex-row items-center justify-between py-4">
                <View className="flex-1">
                  <Text className="mb-1 text-base font-medium">{hour.time}</Text>
                  <View className="flex-row gap-4">
                    <View className="flex-row items-center gap-1">
                      <Droplets size={14} color={colorScheme === 'dark' ? '#999' : '#666'} />
                      <Text variant="muted" size="sm">
                        {hour.humidity}%
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <CloudRain size={14} color={colorScheme === 'dark' ? '#999' : '#666'} />
                      <Text variant="muted" size="sm">
                        {hour.precipitation}%
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Wind size={14} color={colorScheme === 'dark' ? '#999' : '#666'} />
                      <Text variant="muted" size="sm">
                        {hour.windSpeed} km/h
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="items-center">
                  <CloudRain size={32} color={colorScheme === 'dark' ? '#60a5fa' : '#3b82f6'} />
                  <Text className="mt-1 text-xl font-semibold">{hour.temp}°</Text>
                </View>
              </View>
              {index < dayData.hourly.length - 1 && <Separator />}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
