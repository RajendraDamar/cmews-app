import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Separator } from '~/components/ui/separator';
import { Droplets } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';
import { WeatherIcon } from './weather-icon';
import type { HourlyWeatherData } from '~/lib/types/forecast';

interface HourlyBreakdownProps {
  hourly: HourlyWeatherData[];
}

export function HourlyBreakdown({ hourly }: HourlyBreakdownProps) {
  const { colorScheme } = useTheme();

  return (
    <View className="mt-3 gap-2">
      {hourly.map((entry, index) => (
        <View key={index}>
          <View className="flex-row items-center justify-between py-2">
            <Text className="w-16 font-medium">{entry.time}</Text>

            <View className="flex-row items-center gap-2">
              <WeatherIcon weather={entry.weather} size={24} />
            </View>

            <Text className="w-12 text-center font-semibold">{entry.temp}°</Text>

            <View className="flex-row items-center gap-1">
              <Droplets size={14} color={colorScheme === 'dark' ? '#60a5fa' : '#3b82f6'} />
              <Text variant="muted" size="sm" className="w-10">
                {entry.humidity}%
              </Text>
            </View>
          </View>
          {index < hourly.length - 1 && <Separator />}
        </View>
      ))}
    </View>
  );
}
