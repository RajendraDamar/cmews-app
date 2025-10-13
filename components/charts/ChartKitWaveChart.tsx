import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Text } from '~/components/ui/text';
import { COLORS } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';

interface WaveChartData {
  time: string;
  height: number;
  period?: number;
}

interface WaveChartProps {
  data: WaveChartData[];
  width?: number;
  height?: number;
  animated?: boolean;
}

export function ChartKitWaveChart({
  data,
  width: propWidth,
  height: propHeight = 200,
}: WaveChartProps) {
  const { colorScheme } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const width = propWidth || screenWidth - 32;

  // Prepare chart data
  const labels = data.map((d) => d.time);
  const heights = data.map((d) => d.height);

  // Colors
  const waveColor = COLORS.chart.wind; // Using teal color for waves
  const textColor = colorScheme === 'dark' ? '#9ca3af' : '#6b7280';
  const backgroundColor = colorScheme === 'dark' ? '#1f2937' : '#ffffff';
  const gridColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';

  const chartConfig = {
    backgroundColor: backgroundColor,
    backgroundGradientFrom: backgroundColor,
    backgroundGradientTo: backgroundColor,
    decimalPlaces: 1,
    color: (opacity = 1) => waveColor,
    labelColor: (opacity = 1) => textColor,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: waveColor,
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
        data: heights.length > 0 ? heights : [0],
        color: (opacity = 1) => waveColor,
        strokeWidth: 3,
      },
    ],
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
      />

      {/* Legend */}
      <View className="mt-2 flex-row justify-center">
        <View className="flex-row items-center gap-2">
          <View
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: waveColor }}
          />
          <Text size="sm" variant="muted">
            Tinggi Gelombang (m)
          </Text>
        </View>
      </View>
    </View>
  );
}
