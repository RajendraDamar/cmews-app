import { ScrollView, View } from 'react-native';
import { Card, CardContent } from '~/components/ui';
import { Text } from '~/components/ui/text';
import { MOCK_3DAY_FORECAST } from '~/constants/mock-data';
import { Droplets, CloudRain, Wind } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';

export default function Day2Forecast() {
  const { colorScheme } = useTheme();
  const dayData = MOCK_3DAY_FORECAST[1];

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Text className="mb-4 text-xl font-semibold">{dayData.date}</Text>
      <View className="gap-3">
        {dayData.hourly.map((hour, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-semibold">{hour.time}</Text>
                  <View className="mt-2 flex-row gap-4">
                    <View className="flex-row items-center gap-1">
                      <Droplets size={16} color={colorScheme === 'dark' ? '#999' : '#666'} />
                      <Text variant="muted" size="sm">
                        {hour.humidity}%
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <CloudRain size={16} color={colorScheme === 'dark' ? '#999' : '#666'} />
                      <Text variant="muted" size="sm">
                        {hour.precipitation}%
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Wind size={16} color={colorScheme === 'dark' ? '#999' : '#666'} />
                      <Text variant="muted" size="sm">
                        {hour.windSpeed} km/h
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="items-center">
                  <CloudRain size={40} color={colorScheme === 'dark' ? '#60a5fa' : '#3b82f6'} />
                  <Text className="mt-2 text-2xl font-bold">{hour.temp}°</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}
