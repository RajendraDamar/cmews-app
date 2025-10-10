import React from 'react';
import { View } from 'react-native';
import { CartesianChart, Bar } from 'victory-native';
import { getPrecipitationColor } from '~/lib/constants';

interface PrecipitationChartData {
  time: string;
  precipitation: number;
}

interface PrecipitationChartProps {
  data: PrecipitationChartData[];
}

export function PrecipitationChart({ data }: PrecipitationChartProps) {
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
