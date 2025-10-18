import React, { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Text } from '~/components/ui/text';
import { useTheme } from '~/lib/theme-provider';
import { useBreakpoint } from '~/lib/breakpoints';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { COLORS, getThemeColor } from '~/lib/constants';

interface CurrentChartData {
  time: string;
  speed: number;
}

interface CurrentChartProps {
  data: CurrentChartData[];
  width?: number;
  height?: number;
  animated?: boolean;
}

export function ChartKitCurrentChart({
  data,
  width: propWidth,
  height: propHeight = 200,
}: CurrentChartProps) {
  const { colorScheme } = useTheme();
  const { isDesktop } = useBreakpoint();
  const { width: windowWidth } = useWindowDimensions();
  
  // Calculate responsive width
  const responsiveWidth = propWidth || (isDesktop ? Math.min(windowWidth, 896) - 64 : windowWidth - 32);
  const width = responsiveWidth;
  
  const [selectedDataPoint, setSelectedDataPoint] = useState<{ index: number; value: number; dataset: number } | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const themeColors = getThemeColor(colorScheme === 'dark');

  // Prepare chart data
  const labels = data.map((d) => d.time);
  const speeds = data.map((d) => d.speed);

  // Colors
  const currentColor = COLORS.chart.current;
  
  
  

  const chartConfig = {
    backgroundColor: themeColors.card,
    backgroundGradientFrom: themeColors.card,
    backgroundGradientTo: themeColors.card,
    decimalPlaces: 1,
    color: (opacity = 1) => currentColor,
    labelColor: (opacity = 1) => themeColors.muted,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: currentColor,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: themeColors.border,
      strokeWidth: 1,
      strokeOpacity: 0.2,
    },
  };

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: speeds.length > 0 ? speeds : [0],
        color: (opacity = 1) => currentColor,
        strokeWidth: 3,
      },
    ],
  };

  const handleDataPointClick = (dataPointClickData: any) => {
    const { index, value, dataset } = dataPointClickData;
    setSelectedDataPoint({ index, value, dataset });
    setPopoverOpen(true);
  };

  return (
    <View>
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
        fromZero={true}
        onDataPointClick={handleDataPointClick}
      />

      {/* Popup for data point details */}
      {selectedDataPoint !== null && 
       selectedDataPoint.index >= 0 && 
       selectedDataPoint.index < data.length && (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <View />
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <View className="gap-2">
              <Text className="font-semibold">Detail Arus</Text>
              <View className="flex-row justify-between">
                <Text variant="muted" size="sm">Waktu:</Text>
                <Text size="sm" className="font-medium">{data[selectedDataPoint.index]?.time}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text variant="muted" size="sm">Kecepatan:</Text>
                <Text size="sm" className="font-medium">{data[selectedDataPoint.index]?.speed} m/s</Text>
              </View>
            </View>
          </PopoverContent>
        </Popover>
      )}

      {/* Legend */}
      <View className="mt-2 flex-row justify-center">
        <View className="flex-row items-center gap-2">
          <View
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: currentColor }}
          />
          <Text size="sm" variant="muted">
            Kecepatan Arus (m/s)
          </Text>
        </View>
      </View>
    </View>
  );
}
