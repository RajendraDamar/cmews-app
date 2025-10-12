import { View, Platform, Dimensions } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Separator } from '~/components/ui/separator';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '~/components/ui/collapsible';
import { ChevronDown, Wind } from 'lucide-react-native';
import { DirectionArrow } from '~/components/weather/direction-arrow';
import type { WindForecastData } from '~/lib/types/forecast';
import { useState } from 'react';
import { useTheme } from '~/lib/theme-provider';

// ECharts for cross-platform support
let EChartsComponent: any;
if (Platform.OS !== 'web') {
  try {
    const EChartsModule = require('react-native-echarts-wrapper');
    EChartsComponent = EChartsModule.default;
  } catch (e) {
    // ECharts not available
    console.warn('ECharts not available:', e);
  }
}

export function WindCard({ seaArea, direction, speedMin, speedMax, hourly }: WindForecastData) {
  const [isOpen, setIsOpen] = useState(false);
  const { colorScheme } = useTheme();
  const screenWidth = Dimensions.get('window').width;

  // Prepare chart data
  const times = hourly.map((h) => h.time);
  const speeds = hourly.map((h) => h.speed);

  const textColor = colorScheme === 'dark' ? '#9ca3af' : '#6b7280';
  const gridColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';

  const chartOption = {
    grid: {
      left: '12%',
      right: '5%',
      top: '10%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: times,
      axisLabel: {
        color: textColor,
        fontSize: 9,
      },
      axisLine: {
        lineStyle: {
          color: gridColor,
        },
      },
    },
    yAxis: {
      type: 'value',
      name: 'km/h',
      nameTextStyle: {
        color: textColor,
        fontSize: 10,
      },
      axisLabel: {
        color: textColor,
        fontSize: 9,
      },
      axisLine: {
        lineStyle: {
          color: gridColor,
        },
      },
      splitLine: {
        lineStyle: {
          color: gridColor,
          opacity: 0.2,
        },
      },
    },
    series: [
      {
        name: 'Kecepatan Angin',
        type: 'line',
        data: speeds,
        smooth: true,
        itemStyle: {
          color: '#14b8a6',
        },
        lineStyle: {
          width: 2,
        },
        symbol: 'circle',
        symbolSize: 5,
      },
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#ffffff',
      borderColor: gridColor,
      textStyle: {
        color: textColor,
      },
      formatter: '{b}: {c} km/h',
    },
  };

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
            {Platform.OS === 'web' || !EChartsComponent ? (
              <View className="rounded-lg bg-muted p-4">
                <Text className="text-center" size="sm" variant="muted">
                  Grafik tidak tersedia di web. Lihat detail per jam di bawah.
                </Text>
              </View>
            ) : (
              <View style={{ height: 180 }}>
                <EChartsComponent option={chartOption} width={screenWidth - 64} height={180} />
              </View>
            )}

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
