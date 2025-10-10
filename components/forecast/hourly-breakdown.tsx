import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Separator } from '~/components/ui/separator';
import { PrecipitationIcon } from '~/components/weather/precipitation-icon';
import { WeatherIcon } from './weather-icon';
import type { HourlyWeatherData } from '~/lib/types/forecast';

interface HourlyBreakdownProps {
  hourly: HourlyWeatherData[];
}

export function HourlyBreakdown({ hourly }: HourlyBreakdownProps) {
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

            <View className="w-16">
              <PrecipitationIcon percentage={entry.humidity} showPercentage />
            </View>
          </View>
          {index < hourly.length - 1 && <Separator />}
        </View>
      ))}
    </View>
  );
}
