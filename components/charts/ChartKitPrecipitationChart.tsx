import React, { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Text } from '~/components/ui/text';
import { COLORS, getThemeColor } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';
import { useBreakpoint } from '~/lib/breakpoints';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';

const PopoverAny: any = Popover as any;
const PopoverTriggerAny: any = PopoverTrigger as any;
const PopoverContentAny: any = PopoverContent as any;

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
  const { isDesktop } = useBreakpoint();
  const { width: windowWidth } = useWindowDimensions();

  const [containerWidth, setContainerWidth] = React.useState<number>(0);

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
  const precipitations = data.map((d) => d.precipitation);

  // Colors
  const precipColor = COLORS.chart.precipitation;

  const chartConfig = {
    backgroundColor: themeColors.card,
    backgroundGradientFrom: themeColors.card,
    backgroundGradientTo: themeColors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => precipColor,
    labelColor: (opacity = 1) => themeColors.muted,
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
  <View onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      <BarChart
        data={chartData}
        width={width}
        height={propHeight}
        chartConfig={chartConfig}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        yAxisLabel=""
        yAxisSuffix=""
        withInnerLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={true}
        showBarTops={false}
        showValuesOnTopOfBars={false}
        // @ts-ignore: react-native-chart-kit typing may not include onDataPointClick
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
          <PopoverContentAny className="w-48">
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
          </PopoverContentAny>
        </PopoverAny>
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
