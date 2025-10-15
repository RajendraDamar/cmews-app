import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Text } from '~/components/ui/text';
import { COLORS } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';
import { useBreakpoint } from '~/lib/breakpoints';
import { Card, CardContent } from '~/components/ui/card';

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
  height: propHeight,
}: TemperatureChartProps) {
  const { colorScheme } = useTheme();
  const { width: screenWidth, isDesktop, isTablet } = useBreakpoint();
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    temp: number;
    humidity: number;
    time: string;
  } | null>(null);

  // Responsive sizing
  const chartPadding = isDesktop ? 80 : isTablet ? 64 : 48;
  const chartHeight = propHeight || (isDesktop ? 320 : isTablet ? 300 : 280);
  const width = propWidth || Math.max(screenWidth - chartPadding, 300);

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
      r: '5',
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

  const handleDataPointClick = (dataPointData: any) => {
    const { index, x, y } = dataPointData;
    
    const temp = temperatures[index];
    const humidity = humidities[index];
    const time = labels[index];

    setTooltip({
      visible: true,
      x,
      y,
      temp,
      humidity,
      time,
    });

    // Auto-hide tooltip after 3 seconds
    setTimeout(() => {
      setTooltip(null);
    }, 3000);
  };

  return (
    <View>
      <LineChart
        data={chartData}
        width={width}
        height={chartHeight}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
          paddingRight: 16,
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

      {/* Tooltip */}
      {tooltip && Platform.OS === 'web' && (
        <View
          style={{
            position: 'absolute',
            left: tooltip.x - 60,
            top: tooltip.y - 80,
            zIndex: 1000,
          }}>
          <Card className="shadow-lg">
            <CardContent className="p-3">
              <Text className="mb-1 font-semibold">{tooltip.time}</Text>
              <Text className="text-sm" style={{ color: tempColor }}>
                🌡️ Suhu: {tooltip.temp}°C
              </Text>
              <Text className="text-sm" style={{ color: humidityColor }}>
                💧 Kelembapan: {tooltip.humidity}%
              </Text>
            </CardContent>
          </Card>
        </View>
      )}

      {/* Mobile tooltip - shown below chart */}
      {tooltip && Platform.OS !== 'web' && (
        <View className="mt-2">
          <Card>
            <CardContent className="p-3">
              <Text className="mb-1 font-semibold">{tooltip.time}</Text>
              <View className="flex-row justify-between">
                <Text className="text-sm" style={{ color: tempColor }}>
                  🌡️ Suhu: {tooltip.temp}°C
                </Text>
                <Text className="text-sm" style={{ color: humidityColor }}>
                  💧 Kelembapan: {tooltip.humidity}%
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>
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
