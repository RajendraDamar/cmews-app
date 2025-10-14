import { View, Platform, Dimensions } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Separator } from '~/components/ui/separator';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '~/components/ui/collapsible';
import { ChevronDown, MoveHorizontal } from 'lucide-react-native';
import { DirectionArrow } from '~/components/weather/direction-arrow';
import type { CurrentForecastData } from '~/lib/types/forecast';
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

export function CurrentCard({ day, date, speed, direction, hourly }: CurrentForecastData) {
  const [isOpen, setIsOpen] = useState(false);
  const { colorScheme } = useTheme();
  const screenWidth = Dimensions.get('window').width;

  const dateObj = new Date(date);
  const dateStr = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

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
      name: 'm/s',
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
        name: 'Kecepatan Arus',
        type: 'line',
        data: speeds,
        smooth: true,
        itemStyle: {
          color: '#6366f1',
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
      formatter: '{b}: {c} m/s',
    },
  };

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
