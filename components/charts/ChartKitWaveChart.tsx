import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Text } from '~/components/ui/text';
import { COLORS } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';
import { useBreakpoint } from '~/lib/breakpoints';
import { Card, CardContent } from '~/components/ui/card';

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
  height: propHeight,
}: WaveChartProps) {
  const { colorScheme } = useTheme();
  const { width: screenWidth, isDesktop, isTablet } = useBreakpoint();
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    time: string;
    height: number;
  } | null>(null);

  // Responsive sizing
  const chartPadding = isDesktop ? 80 : isTablet ? 64 : 48;
  const chartHeight = propHeight || (isDesktop ? 300 : isTablet ? 280 : 260);
  const width = propWidth || Math.max(screenWidth - chartPadding, 300);

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
      r: '5',
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

  const handleDataPointClick = (dataPointData: any) => {
    const { index, x, y } = dataPointData;
    
    setTooltip({
      visible: true,
      x,
      y,
      time: labels[index],
      height: heights[index],
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
        fromZero={true}
        onDataPointClick={handleDataPointClick}
      />

      {/* Tooltip */}
      {tooltip && Platform.OS === 'web' && (
        <View
          style={{
            position: 'absolute',
            left: tooltip.x - 60,
            top: tooltip.y - 70,
            zIndex: 1000,
          }}>
          <Card className="shadow-lg">
            <CardContent className="p-3">
              <Text className="mb-1 font-semibold">{tooltip.time}</Text>
              <Text className="text-sm" style={{ color: waveColor }}>
                🌊 Tinggi: {tooltip.height} m
              </Text>
            </CardContent>
          </Card>
        </View>
      )}

      {/* Mobile tooltip */}
      {tooltip && Platform.OS !== 'web' && (
        <View className="mt-2">
          <Card>
            <CardContent className="p-3">
              <Text className="mb-1 font-semibold">{tooltip.time}</Text>
              <Text className="text-sm" style={{ color: waveColor }}>
                🌊 Tinggi Gelombang: {tooltip.height} m
              </Text>
            </CardContent>
          </Card>
        </View>
      )}

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
