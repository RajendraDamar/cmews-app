import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Text } from '~/components/ui/text';
import { COLORS } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';

interface WindChartData {
  direction: string;
  speed: number;
  directionDegrees: number;
}

interface WindChartProps {
  data: WindChartData[];
  width?: number;
  height?: number;
  animated?: boolean;
}

export function ChartKitWindChart({
  data,
  width: propWidth,
  height: propHeight = 250,
}: WindChartProps) {
  const { colorScheme } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const width = propWidth || screenWidth - 32;
  const [selectedDataPoint, setSelectedDataPoint] = useState<{ index: number; value: number; dataset: number } | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Prepare chart data - display wind speed by direction
  const labels = data.map((d) => d.direction);
  const speeds = data.map((d) => d.speed);

  // Colors
  const windColor = COLORS.chart.wind;
  const textColor = colorScheme === 'dark' ? '#9ca3af' : '#6b7280';
  const backgroundColor = colorScheme === 'dark' ? '#1f2937' : '#ffffff';
  const gridColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';

  const chartConfig = {
    backgroundColor: backgroundColor,
    backgroundGradientFrom: backgroundColor,
    backgroundGradientTo: backgroundColor,
    decimalPlaces: 0,
    color: (opacity = 1) => windColor,
    labelColor: (opacity = 1) => textColor,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: gridColor,
      strokeWidth: 1,
      strokeOpacity: 0.2,
    },
  };

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: speeds.length > 0 ? speeds : [0],
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
        onDataPointClick={handleDataPointClick}
      />

      {/* Popup for data point details */}
      {selectedDataPoint !== null && selectedDataPoint.index < data.length && (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <View />
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <View className="gap-2">
              <Text className="font-semibold">Detail Angin</Text>
              <View className="flex-row justify-between">
                <Text variant="muted" size="sm">Arah:</Text>
                <Text size="sm" className="font-medium">{data[selectedDataPoint.index]?.direction}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text variant="muted" size="sm">Kecepatan:</Text>
                <Text size="sm" className="font-medium">{data[selectedDataPoint.index]?.speed} km/h</Text>
              </View>
            </View>
          </PopoverContent>
        </Popover>
      )}
    </View>
  );
}
