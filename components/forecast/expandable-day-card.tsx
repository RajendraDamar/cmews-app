import { View } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Separator } from '~/components/ui/separator';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '~/components/ui/collapsible';
import { ChevronDown } from 'lucide-react-native';
import { WeatherIcon } from './weather-icon';
import { HourlyBreakdown } from './hourly-breakdown';
import { TemperatureChart } from './temperature-chart';
import { PrecipitationChart } from './precipitation-chart';
import type { WeatherForecastDay } from '~/lib/types/forecast';
import { useState } from 'react';
import { useTheme } from '~/lib/theme-provider';

export function ExpandableDayCard({
  day,
  date,
  weather,
  tempMin,
  tempMax,
  hourly,
}: WeatherForecastDay) {
  const [isOpen, setIsOpen] = useState(false);
  const { colorScheme } = useTheme();

  const dateObj = new Date(date);
  const dateStr = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardContent className="p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-semibold">{day}</Text>
                <Text variant="muted" size="sm">
                  {dateStr}
                </Text>
              </View>

              <View className="flex-row items-center gap-4">
                <WeatherIcon weather={weather} size={32} />

                <View className="items-end">
                  <Text className="text-lg font-bold">
                    {tempMax}° / {tempMin}°
                  </Text>
                  <Text variant="muted" size="sm">
                    {weather}
                  </Text>
                </View>

                <ChevronDown
                  size={20}
                  color={colorScheme === 'dark' ? '#888' : '#666'}
                  style={{
                    transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
                  }}
                />
              </View>
            </View>
          </CardContent>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="px-4 pb-4">
            <Separator className="mb-3" />

            {/* Temperature & Humidity Chart */}
            <Text className="mb-2 font-semibold">Grafik Suhu & Kelembapan</Text>
            <TemperatureChart data={hourly} />

            <Separator className="my-4" />

            {/* Precipitation Chart */}
            <Text className="mb-2 font-semibold">Curah Hujan</Text>
            <PrecipitationChart
              data={hourly.map((h) => ({ time: h.time, precipitation: h.humidity }))}
            />

            <Separator className="my-4" />

            {/* Hourly Breakdown */}
            <Text className="mb-2 font-semibold">Prakiraan Per 3 Jam</Text>
            <HourlyBreakdown hourly={hourly} />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
