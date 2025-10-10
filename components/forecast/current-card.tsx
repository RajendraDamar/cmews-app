import { View } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Separator } from '~/components/ui/separator';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '~/components/ui/collapsible';
import { ChevronDown, MoveHorizontal } from 'lucide-react-native';
import { DirectionArrow } from '~/components/weather/direction-arrow';
import { CartesianChart, Line } from 'victory-native';
import type { CurrentForecastData } from '~/lib/types/forecast';
import { useState } from 'react';
import { useTheme } from '~/lib/theme-provider';

export function CurrentCard({ seaArea, speed, direction, hourly }: CurrentForecastData) {
  const [isOpen, setIsOpen] = useState(false);
  const { colorScheme } = useTheme();

  // Prepare chart data
  const chartData = hourly.map((h, i) => ({ x: i, speed: h.speed }));

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
                <View className="rounded-full bg-indigo-500/20 p-2">
                  <MoveHorizontal size={24} color="#6366f1" />
                </View>

                <View className="items-end">
                  <Text className="font-bold">{speed} m/s</Text>
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

            {/* Current Speed Chart */}
            <Text className="mb-2 font-semibold">Kecepatan Arus (m/s)</Text>
            <View style={{ height: 180 }}>
              <CartesianChart
                data={chartData}
                xKey="x"
                yKeys={['speed']}
                domainPadding={{ left: 10, right: 10, top: 20, bottom: 20 }}>
                {({ points }) => (
                  <Line
                    points={points.speed}
                    color="#6366f1"
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
                    <View className="flex-1 items-center">
                      <DirectionArrow direction={entry.direction} size={20} showLabel />
                    </View>
                    <Text className="w-20 text-right font-semibold">{entry.speed} m/s</Text>
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
