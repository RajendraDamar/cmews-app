import { View, ScrollView, useWindowDimensions } from 'react-native';
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
import * as Haptics from 'expo-haptics';
import { getThemeColor } from '~/lib/constants';

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
  const { width } = useWindowDimensions();
  const themeColors = getThemeColor(colorScheme === 'dark');
  
  // Add horizontal scroll for very narrow screens
  const needsScroll = width < 360;

  const handleToggle = (open: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsOpen(open);
  };

  const dateObj = new Date(date);
  const dateStr = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

  return (
    <Collapsible open={isOpen} onOpenChange={handleToggle}>
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
                  color={themeColors.muted}
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
            <View className="mb-4">
              <Text className="mb-2 font-semibold">Grafik Suhu & Kelembapan</Text>
              {needsScroll ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <TemperatureChart data={hourly} />
                </ScrollView>
              ) : (
                <View className="md:px-4">
                  <TemperatureChart data={hourly} />
                </View>
              )}
            </View>

            <Separator className="my-4" />

            {/* Precipitation Chart */}
            <View className="mb-4">
              <Text className="mb-2 font-semibold">Curah Hujan</Text>
              {needsScroll ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <PrecipitationChart
                    data={hourly.map((h) => ({ time: h.time, precipitation: h.humidity }))}
                  />
                </ScrollView>
              ) : (
                <View className="md:px-4">
                  <PrecipitationChart
                    data={hourly.map((h) => ({ time: h.time, precipitation: h.humidity }))}
                  />
                </View>
              )}
            </View>

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
