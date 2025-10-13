import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Text } from '~/components/ui/text';
import { COLORS } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';

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
  const screenWidth = Dimensions.get('window').width;
  const width = propWidth || screenWidth - 32;

  // Prepare chart data
  const labels = data.map((d) => d.time);
  const temperatures = data.map((d) => d.temp);
  const humidities = data.map((d) => d.humidity);

  // Colors
  const tempColor = COLORS.chart.temperature;
  const humidityColor = COLORS.chart.humidity;
  const textColor = colorScheme === 'dark' ? '#9ca3af' : '#6b7280';
  const backgroundColor = colorScheme === 'dark' ? '#1f2937' : '#ffffff';
  const gridColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';

  const chartConfig = {
    backgroundColor: backgroundColor,
    backgroundGradientFrom: backgroundColor,
    backgroundGradientTo: backgroundColor,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // Temperature color
    labelColor: (opacity = 1) => textColor,
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
      stroke: gridColor,
      strokeWidth: 1,
      strokeOpacity: 0.2,
    },
  };

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: temperatures,
        color: (opacity = 1) => tempColor,
        strokeWidth: 3,
      },
      {
        data: humidities,
        color: (opacity = 1) => humidityColor,
        strokeWidth: 2,
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
        fromZero={false}
      />

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
