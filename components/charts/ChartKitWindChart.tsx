import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Text } from '~/components/ui/text';
import { COLORS } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';
import { useBreakpoint } from '~/lib/breakpoints';
import { Card, CardContent } from '~/components/ui/card';

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
  height: propHeight,
}: WindChartProps) {
  const { colorScheme } = useTheme();
  const { width: screenWidth, isDesktop, isTablet } = useBreakpoint();
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    direction: string;
    speed: number;
  } | null>(null);

  // Responsive sizing
  const chartPadding = isDesktop ? 80 : isTablet ? 64 : 48;
  const chartHeight = propHeight || (isDesktop ? 320 : isTablet ? 300 : 280);
  const width = propWidth || Math.max(screenWidth - chartPadding, 300);

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

  const handleDataPointClick = (dataPointData: any) => {
    const { index, x, y } = dataPointData;
    
    setTooltip({
      visible: true,
      x,
      y,
      direction: labels[index],
      speed: speeds[index],
    });

    // Auto-hide tooltip after 3 seconds
    setTimeout(() => {
      setTooltip(null);
    }, 3000);
  };

  return (
    <View>
      <BarChart
        data={chartData}
        width={width}
        height={chartHeight}
        chartConfig={chartConfig}
        style={{
          marginVertical: 8,
          borderRadius: 16,
          paddingRight: 16,
        }}
        yAxisLabel=""
        yAxisSuffix=" km/h"
        withInnerLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={true}
        showBarTops={false}
        showValuesOnTopOfBars={false}
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
              <Text className="mb-1 font-semibold">🌬️ {tooltip.direction}</Text>
              <Text className="text-sm" style={{ color: windColor }}>
                Kecepatan: {tooltip.speed} km/h
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
              <Text className="mb-1 font-semibold">🌬️ {tooltip.direction}</Text>
              <Text className="text-sm" style={{ color: windColor }}>
                Kecepatan: {tooltip.speed} km/h
              </Text>
            </CardContent>
          </Card>
        </View>
      )}

      {/* Compact legend for desktop */}
      {isDesktop && (
        <View className="mt-2">
          <Text size="sm" variant="muted" className="text-center">
            Tap pada bar untuk melihat detail
          </Text>
        </View>
      )}
    </View>
  );
}
