import React from 'react';
import { View, Dimensions } from 'react-native';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from 'victory-native';
import { useTheme } from '~/lib/theme-provider';
import { getPrecipitationColor } from '~/lib/constants';

interface PrecipitationChartData {
  time: string;
  precipitation: number;
}

interface PrecipitationChartProps {
  data: PrecipitationChartData[];
}

export function PrecipitationChart({ data }: PrecipitationChartProps) {
  const { colorScheme } = useTheme();
  const width = Dimensions.get('window').width - 32;

  const chartData = data.map((d, i) => ({
    x: i,
    y: d.precipitation,
    fill: getPrecipitationColor(d.precipitation),
  }));

  const axisColor = colorScheme === 'dark' ? '#888' : '#666';
  const gridColor = colorScheme === 'dark' ? '#333' : '#e5e7eb';

  return (
    <View>
      <VictoryChart
        width={width}
        height={200}
        theme={VictoryTheme.material}
        padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
        domainPadding={{ x: 20 }}>
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: gridColor },
            tickLabels: { fill: axisColor, fontSize: 10 },
            grid: { stroke: gridColor, strokeDasharray: '4,4' },
          }}
          tickFormat={(t) => `${t}%`}
        />
        <VictoryAxis
          tickFormat={(t) => data[t]?.time || ''}
          style={{
            axis: { stroke: gridColor },
            tickLabels: { fill: axisColor, fontSize: 10, angle: -45, textAnchor: 'end' },
          }}
        />

        <VictoryBar
          data={chartData}
          style={{
            data: {
              fill: ({ datum }) => datum.fill,
            },
          }}
          cornerRadius={{ top: 4 }}
        />
      </VictoryChart>
    </View>
  );
}
