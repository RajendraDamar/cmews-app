import React from 'react';
import { View, Platform } from 'react-native';
import { Text } from '~/components/ui/text';
import { getPrecipitationColor } from '~/lib/constants';

// Conditional import for victory-native (not supported on web)
let CartesianChart: any, Bar: any;
if (Platform.OS !== 'web') {
  try {
    const victory = require('victory-native');
    CartesianChart = victory.CartesianChart;
    Bar = victory.Bar;
  } catch (e) {
    // Victory Native not available
  }
}

interface PrecipitationChartData {
  time: string;
  precipitation: number;
}

interface PrecipitationChartProps {
  data: PrecipitationChartData[];
}

export function PrecipitationChart({ data }: PrecipitationChartProps) {
  // Web fallback - show data in text format
  if (Platform.OS === 'web' || !CartesianChart) {
    return (
      <View className="p-4 bg-muted rounded-lg">
        <Text size="sm" variant="muted" className="text-center mb-2">
          Grafik tidak tersedia di web
        </Text>
        <View className="gap-1">
          {data.slice(0, 5).map((d, i) => (
            <View key={i} className="flex-row justify-between">
              <Text size="sm">{d.time}</Text>
              <Text size="sm">Curah Hujan: {d.precipitation}mm</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  const chartData = data.map((d, i) => ({
    x: i,
    precipitation: d.precipitation,
  }));

  return (
    <View>
      <View style={{ height: 200 }}>
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={['precipitation']}
          domainPadding={{ left: 20, right: 20, top: 20, bottom: 20 }}>
          {({ points, chartBounds }) => (
            <Bar
              points={points.precipitation}
              chartBounds={chartBounds}
              color={getPrecipitationColor(50)}
              roundedCorners={{ topLeft: 4, topRight: 4 }}
            />
          )}
        </CartesianChart>
      </View>
    </View>
  );
}
