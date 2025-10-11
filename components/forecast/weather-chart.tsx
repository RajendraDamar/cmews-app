import { View, Platform } from 'react-native';
import { Text } from '~/components/ui/text';

// Conditional import for victory-native (not supported on web)
let CartesianChart: any, Line: any, Area: any;
if (Platform.OS !== 'web') {
  try {
    const victory = require('victory-native');
    CartesianChart = victory.CartesianChart;
    Line = victory.Line;
    Area = victory.Area;
  } catch (e) {
    // Victory Native not available
  }
}

interface ChartDataPoint {
  time: string;
  temp: number;
  humidity: number;
}

interface WeatherChartProps {
  data: ChartDataPoint[];
}

export function WeatherChart({ data }: WeatherChartProps) {
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
              <Text size="sm">{d.temp}°C</Text>
              <Text size="sm">{d.humidity}%</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  // Transform data for victory-native v41
  const chartData = data.map((d, i) => ({
    x: i,
    temp: d.temp,
    humidity: d.humidity,
  }));

  return (
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
              color="#3b82f6"
              opacity={0.2}
              curveType="catmullRom"
            />
            <Line points={points.temp} color="#f97316" strokeWidth={2} curveType="catmullRom" />
          </>
        )}
      </CartesianChart>
    </View>
  );
}
