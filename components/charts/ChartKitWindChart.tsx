import React from 'react';
import { View, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Text } from '~/components/ui/text';
import { COLORS } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';

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
      />

      {/* Legend */}
      <View className="mt-2 flex-row justify-center gap-4 flex-wrap">
        {data.map((d, i) => (
          <View key={`legend-${i}`} className="flex-row items-center gap-1">
            <View
              className="h-2 w-8"
              style={{ backgroundColor: windColor }}
            />
            <Text size="sm" variant="muted">
              {d.direction}: {d.speed} km/h
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
