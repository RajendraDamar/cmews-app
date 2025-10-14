import { View } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Separator } from '~/components/ui/separator';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '~/components/ui/collapsible';
import { ChevronDown, Wind } from 'lucide-react-native';
import { DirectionArrow } from '~/components/weather/direction-arrow';
import { ChartKitWindChart } from '~/components/charts';
import type { WindForecastData } from '~/lib/types/forecast';
import { useState } from 'react';
import { useTheme } from '~/lib/theme-provider';

export function WindCard({ day, date, direction, speedMin, speedMax, hourly }: WindForecastData) {
  const [isOpen, setIsOpen] = useState(false);
  const { colorScheme } = useTheme();

  // Prepare chart data for ChartKitWindChart
  const windChartData = hourly.map((h) => ({
    direction: h.direction,
    speed: h.speed,
    directionDegrees: getDirectionDegrees(h.direction),
  }));

  // Calculate Beaufort scale (simplified)
  const avgSpeed = (speedMin + speedMax) / 2;
  let beaufortScale = Math.floor(avgSpeed / 5);
  if (beaufortScale > 12) beaufortScale = 12;

  const beaufortDescriptions: { [key: number]: string } = {
    0: 'Tenang',
    1: 'Tenang',
    2: 'Berombak Ringan',
    3: 'Berombak Ringan',
    4: 'Sedang',
    5: 'Sedang',
    6: 'Agak Kasar',
    7: 'Kasar',
    8: 'Sangat Kasar',
    9: 'Badai',
    10: 'Badai Kuat',
    11: 'Badai Dahsyat',
    12: 'Topan',
  };

  const beaufortDesc = beaufortDescriptions[beaufortScale] || 'Sedang';

  const dateObj = new Date(date);
  const dateStr = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

  // Helper function to convert direction string to degrees
  function getDirectionDegrees(dir: string): number {
    const directionMap: { [key: string]: number } = {
      'Utara': 0,
      'Timur Laut': 45,
      'Timur': 90,
      'Tenggara': 135,
      'Selatan': 180,
      'Barat Daya': 225,
      'Barat': 270,
      'Barat Laut': 315,
    };
    return directionMap[dir] || 0;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardContent className="p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-semibold">{day}</Text>
                <Text variant="muted" size="sm">
                  {dateStr} - {direction}
                </Text>
              </View>

              <View className="flex-row items-center gap-4">
                <View className="rounded-full bg-teal-500/20 p-2">
                  <Wind size={24} color="#14b8a6" />
                </View>

                <View className="items-end">
                  <Text className="font-bold">
                    {speedMin}-{speedMax} km/h
                  </Text>
                  <Text variant="muted" size="sm">
                    {beaufortDesc}
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

            {/* Wind Speed Chart */}
            <Text className="mb-2 font-semibold">Kompas Arah Angin</Text>
            <ChartKitWindChart data={windChartData} animated={true} />

            <Separator className="my-4" />

            {/* Hourly Breakdown */}
            <Text className="mb-2 font-semibold">Detail Per 3 Jam</Text>
            <View className="gap-2">
              {hourly.map((entry, index) => (
                <View key={index}>
                  <View className="flex-row items-center justify-between py-2">
                    <Text className="w-16 font-medium">{entry.time}</Text>
                    <View className="flex-1 items-center">
                      <DirectionArrow direction={entry.direction} size={20} showLabel />
                    </View>
                    <Text className="w-20 text-right font-semibold">{entry.speed} km/h</Text>
                  </View>
                  {index < hourly.length - 1 && <Separator />}
                </View>
              ))}
            </View>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
