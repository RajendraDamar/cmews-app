import React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { CartesianChart, Line, Area } from 'victory-native';
import { COLORS } from '~/lib/constants';

interface TemperatureChartData {
  time: string;
  temp: number;
  humidity: number;
}

interface TemperatureChartProps {
  data: TemperatureChartData[];
}

export function TemperatureChart({ data }: TemperatureChartProps) {
  // Transform data for victory-native v41
  const chartData = data.map((d, i) => ({
    x: i,
    temp: d.temp,
    humidity: d.humidity,
  }));

  return (
    <View>
      <View style={{ height: 200 }}>
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={['temp', 'humidity']}
          domainPadding={{ left: 10, right: 10, top: 20, bottom: 20 }}>
          {({ points }) => (
            <>
              <Area
                points={points.humidity}
                y0={0}
                color={COLORS.chart.humidity}
                opacity={0.2}
                curveType="catmullRom"
              />
              <Line
                points={points.temp}
                color={COLORS.chart.temperature}
                strokeWidth={3}
                curveType="catmullRom"
              />
            </>
          )}
        </CartesianChart>
      </View>

      {/* Legend */}
      <View className="mt-2 flex-row justify-center gap-6">
        <View className="flex-row items-center gap-2">
          <View
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: COLORS.chart.temperature }}
          />
          <Text size="sm" variant="muted">
            Suhu (°C)
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: COLORS.chart.humidity }}
          />
          <Text size="sm" variant="muted">
            Kelembapan (%)
          </Text>
        </View>
      </View>
    </View>
  );
}
