import { View } from 'react-native';
import { CartesianChart, Line, Area } from 'victory-native';

interface ChartDataPoint {
  time: string;
  temp: number;
  humidity: number;
}

interface WeatherChartProps {
  data: ChartDataPoint[];
}

export function WeatherChart({ data }: WeatherChartProps) {
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
