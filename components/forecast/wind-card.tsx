import { View } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Separator } from '~/components/ui/separator';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '~/components/ui/collapsible';
import { ChevronDown, Wind } from 'lucide-react-native';
import { CartesianChart, Line } from 'victory-native';
import type { WindForecastData } from '~/lib/types/forecast';
import { useState } from 'react';
import { useTheme } from '~/lib/theme-provider';

export function WindCard({ seaArea, direction, speedMin, speedMax, hourly }: WindForecastData) {
  const [isOpen, setIsOpen] = useState(false);
  const { colorScheme } = useTheme();

  // Prepare chart data
  const chartData = hourly.map((h, i) => ({ x: i, speed: h.speed }));

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

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardContent className="p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-semibold">{seaArea}</Text>
                <Text variant="muted" size="sm">
                  {direction}
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
            <Text className="mb-2 font-semibold">Kecepatan Angin (km/h)</Text>
            <View style={{ height: 180 }}>
              <CartesianChart
                data={chartData}
                xKey="x"
                yKeys={['speed']}
                domainPadding={{ left: 10, right: 10, top: 20, bottom: 20 }}>
                {({ points }) => (
                  <Line
                    points={points.speed}
                    color="#14b8a6"
                    strokeWidth={2}
                    curveType="catmullRom"
                  />
                )}
              </CartesianChart>
            </View>

            <Separator className="my-4" />

            {/* Hourly Breakdown */}
            <Text className="mb-2 font-semibold">Detail Per 3 Jam</Text>
            <View className="gap-2">
              {hourly.map((entry, index) => (
                <View key={index}>
                  <View className="flex-row items-center justify-between py-2">
                    <Text className="w-16 font-medium">{entry.time}</Text>
                    <Text className="flex-1 text-center" variant="muted" size="sm">
                      {entry.direction}
                    </Text>
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
