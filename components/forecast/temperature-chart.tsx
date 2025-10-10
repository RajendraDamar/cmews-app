import React from 'react';
import { View, Dimensions } from 'react-native';
import { Text } from '~/components/ui/text';
import { VictoryChart, VictoryLine, VictoryArea, VictoryAxis, VictoryTheme } from 'victory-native';
import { useTheme } from '~/lib/theme-provider';
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
  const { colorScheme } = useTheme();
  const width = Dimensions.get('window').width - 32;

  const tempData = data.map((d, i) => ({ x: i, y: d.temp }));
  const humidityData = data.map((d, i) => ({ x: i, y: d.humidity }));

  const axisColor = colorScheme === 'dark' ? '#888' : '#666';
  const gridColor = colorScheme === 'dark' ? '#333' : '#e5e7eb';

  return (
    <View>
      <VictoryChart
        width={width}
        height={200}
        theme={VictoryTheme.material}
        padding={{ top: 20, bottom: 40, left: 50, right: 20 }}>
        {/* Grid lines */}
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: gridColor },
            tickLabels: { fill: axisColor, fontSize: 10 },
            grid: { stroke: gridColor, strokeDasharray: '4,4' },
          }}
        />
        <VictoryAxis
          tickFormat={(t) => data[t]?.time || ''}
          style={{
            axis: { stroke: gridColor },
            tickLabels: { fill: axisColor, fontSize: 10, angle: -45, textAnchor: 'end' },
          }}
        />

        {/* Humidity Area */}
        <VictoryArea
          data={humidityData}
          style={{
            data: {
              fill: COLORS.chart.humidity,
              fillOpacity: 0.2,
              stroke: COLORS.chart.humidity,
              strokeWidth: 2,
            },
          }}
        />

        {/* Temperature Line */}
        <VictoryLine
          data={tempData}
          style={{
            data: {
              stroke: COLORS.chart.temperature,
              strokeWidth: 3,
            },
          }}
        />
      </VictoryChart>

      {/* Legend */}
      <View className="flex-row justify-center gap-6 mt-2">
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
