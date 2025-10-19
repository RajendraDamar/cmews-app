import React, { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Text } from '~/components/ui/text';
import { COLORS, getThemeColor } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';
import { useBreakpoint } from '~/lib/breakpoints';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';

// Workaround: some UI popover typings differ from usage here; cast to any to avoid TS errors
const PopoverAny: any = Popover as any;
const PopoverTriggerAny: any = PopoverTrigger as any;
const PopoverContentAny: any = PopoverContent as any;

interface TemperatureChartData {
  time: string;
  temp: number;
  humidity: number;
}

interface TemperatureChartProps {
  data: TemperatureChartData[];
  width?: number;
  height?: number;
  animated?: boolean;
}

export function ChartKitTemperatureChart({
  data,
  width: propWidth,
  height: propHeight = 220,
}: TemperatureChartProps) {
  const { colorScheme } = useTheme();
  const { isDesktop } = useBreakpoint();
  const { width: windowWidth } = useWindowDimensions();

  // Measure actual container width to avoid guesswork and trailing empty space
  const [containerWidth, setContainerWidth] = React.useState<number>(0);

  // Calculate responsive width using measured container when available, otherwise fallback
  const width =
    propWidth ||
    (containerWidth > 0
      ? containerWidth
      : isDesktop
      ? Math.min(windowWidth, 896) - 64
      : windowWidth - 32);
  
  const [selectedDataPoint, setSelectedDataPoint] = useState<{ index: number; value: number; dataset: number } | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const themeColors = getThemeColor(colorScheme === 'dark');

  // Prepare chart data
  const labels = data.map((d) => d.time);
  const temperatures = data.map((d) => d.temp);
  const humidities = data.map((d) => d.humidity);

  // Colors
  const tempColor = COLORS.chart.temperature;
  const humidityColor = COLORS.chart.humidity;

  const chartConfig = {
    backgroundColor: themeColors.card,
    backgroundGradientFrom: themeColors.card,
    backgroundGradientTo: themeColors.card,
    decimalPlaces: 1,
    // Use theme-aware primary colors for lines and fall back to COLORS tokens
    color: (opacity = 1) => `rgba(${hexToRgb(themeColors.primary || '#3b82f6')}, ${opacity})`,
    labelColor: (opacity = 1) => themeColors.muted,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: tempColor,
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // solid line
      stroke: themeColors.border,
      strokeWidth: 1,
      strokeOpacity: 0.2,
    },
  };

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: temperatures,
        color: (opacity = 1) => `rgba(${hexToRgb(tempColor)}, ${opacity})`,
        strokeWidth: 3,
      },
      {
        data: humidities,
        color: (opacity = 1) => `rgba(${hexToRgb(humidityColor)}, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

// Helper: convert hex or hsl start values to r,g,b string for rgba
function hexToRgb(hexOrHsl: string): string {
  // If hsl, attempt to compute approximate rgb by parsing numbers
  if (hexOrHsl.startsWith('hsl')) {
    // crude parse: hsl(h s% l%) -> convert to rgb via a basic algorithm
    try {
      const inner = hexOrHsl.replace(/hsl\(|\)|%/g, '').split(' ').map((s) => s.replace(',', ''));
      const h = Number(inner[0]);
      const s = Number(inner[1]) / 100;
      const l = Number(inner[2]) / 100;
      // HSL to RGB conversion (0..1 range)
      const a = s * Math.min(l, 1 - l);
      const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color);
      };
      return `${f(0)}, ${f(8)}, ${f(4)}`;
    } catch {
      return '59,130,246';
    }
  }

  // If hex like #rrggbb
  const hex = hexOrHsl.replace('#', '');
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
  return '59,130,246';
}

  const handleDataPointClick = (dataPointClickData: any) => {
    const { index, value, dataset } = dataPointClickData;
    setSelectedDataPoint({ index, value, dataset });
    setPopoverOpen(true);
  };

  return (
  <View onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      <LineChart
        data={chartData}
        width={width}
        height={propHeight}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        withDots={true}
        withShadow={false}
        fromZero={false}
        onDataPointClick={handleDataPointClick}
      />

      {/* Popup for data point details */}
      {selectedDataPoint !== null && 
       selectedDataPoint.index >= 0 && 
       selectedDataPoint.index < data.length && (
        <PopoverAny open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTriggerAny asChild>
            <View />
          </PopoverTriggerAny>
          <PopoverContentAny className="w-56">
            <View className="gap-2">
              <Text className="font-semibold">Detail Cuaca</Text>
              <View className="flex-row justify-between">
                <Text variant="muted" size="sm">Waktu:</Text>
                <Text size="sm" className="font-medium">{data[selectedDataPoint.index]?.time}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text variant="muted" size="sm">
                  {selectedDataPoint.dataset === 0 ? 'Suhu:' : 'Kelembapan:'}
                </Text>
                <Text size="sm" className="font-medium">
                  {selectedDataPoint.dataset === 0 
                    ? `${data[selectedDataPoint.index]?.temp}°C`
                    : `${data[selectedDataPoint.index]?.humidity}%`
                  }
                </Text>
              </View>
            </View>
          </PopoverContentAny>
        </PopoverAny>
      )}

      {/* Legend */}
      <View className="mt-2 flex-row justify-center gap-6">
        <View className="flex-row items-center gap-2">
          <View
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: tempColor }}
          />
          <Text size="sm" variant="muted">
            Suhu (°C)
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: humidityColor }}
          />
          <Text size="sm" variant="muted">
            Kelembapan (%)
          </Text>
        </View>
      </View>
    </View>
  );
}
