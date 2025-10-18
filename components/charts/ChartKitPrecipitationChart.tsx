import React, { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Text } from '~/components/ui/text';
import { COLORS, getThemeColor } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';
import { useBreakpoint } from '~/lib/breakpoints';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';

interface PrecipitationChartData {
  time: string;
  precipitation: number;
}

interface PrecipitationChartProps {
  data: PrecipitationChartData[];
  width?: number;
  height?: number;
  animated?: boolean;
}

export function ChartKitPrecipitationChart({
  data,
  width: propWidth,
  height: propHeight = 200,
}: PrecipitationChartProps) {
  const { colorScheme } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const { isMobile } = useBreakpoint();
  
  // Responsive width: mobile uses window width - 32px padding, desktop uses max 960px
  const calculatedWidth = isMobile ? windowWidth - 32 : Math.min(windowWidth - 64, 960);
  const width = propWidth || calculatedWidth;
  
  const [selectedDataPoint, setSelectedDataPoint] = useState<{ index: number; value: number; dataset: number } | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const themeColors = getThemeColor(colorScheme === 'dark');

  // Prepare chart data
  const labels = data.map((d) => d.time);
  const precipitations = data.map((d) => d.precipitation);

  // Colors
  const precipColor = COLORS.chart.precipitation;

  const chartConfig = {
    backgroundColor: themeColors.card,
    backgroundGradientFrom: themeColors.card,
    backgroundGradientTo: themeColors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => {
      // Parse HSL color to RGB for opacity - blue-500
      const rgb = colorScheme === 'dark' ? '96, 165, 250' : '59, 130, 246'; // blue-400/blue-500
      return `rgba(${rgb}, ${opacity})`;
    },
    labelColor: (opacity = 1) => {
      const rgb = colorScheme === 'dark' ? '156, 163, 175' : '107, 114, 128'; // gray-400/gray-500
      return `rgba(${rgb}, ${opacity})`;
    },
    style: {
      borderRadius: 16,
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
        data: precipitations.length > 0 ? precipitations : [0],
      },
    ],
  };

  const handleDataPointClick = (dataPointClickData: any) => {
    const { index, value, dataset } = dataPointClickData;
    setSelectedDataPoint({ index, value, dataset });
    setPopoverOpen(true);
  };

  return (
    <View className={!isMobile ? 'mx-auto' : ''}>
      <BarChart
        data={chartData}
        width={width}
        height={propHeight}
        chartConfig={chartConfig}
        style={{
          marginVertical: 8,
          borderRadius: 16,
          backgroundColor: themeColors.card,
        }}
        yAxisLabel=""
        yAxisSuffix=""
        withInnerLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={true}
        showBarTops={false}
        showValuesOnTopOfBars={false}
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
              <Text className="font-semibold">Detail Curah Hujan</Text>
              <View className="flex-row justify-between">
                <Text variant="muted" size="sm">Waktu:</Text>
                <Text size="sm" className="font-medium">{data[selectedDataPoint.index]?.time}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text variant="muted" size="sm">Curah Hujan:</Text>
                <Text size="sm" className="font-medium">{data[selectedDataPoint.index]?.precipitation} mm</Text>
              </View>
            </View>
          </PopoverContent>
        </Popover>
      )}

      {/* Legend */}
      <View className="mt-2 flex-row justify-center">
        <View className="flex-row items-center gap-2">
          <View
            className="h-3 w-3 rounded"
            style={{ backgroundColor: precipColor }}
          />
          <Text size="sm" variant="muted">
            Curah Hujan (mm)
          </Text>
        </View>
      </View>
    </View>
  );
}
