import React from 'react';
import { View, Platform, Dimensions } from 'react-native';
import { Text } from '~/components/ui/text';
import { COLORS } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';

// ECharts for cross-platform support
let EChartsComponent: any;
if (Platform.OS !== 'web') {
  try {
    const EChartsModule = require('react-native-echarts-wrapper');
    EChartsComponent = EChartsModule.default;
  } catch (e) {
    // ECharts not available
    console.warn('ECharts not available:', e);
  }
}

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
  const screenWidth = Dimensions.get('window').width;

  // Prepare chart data
  const times = data.map((d) => d.time);
  const temps = data.map((d) => d.temp);
  const humidities = data.map((d) => d.humidity);

  const textColor = colorScheme === 'dark' ? '#9ca3af' : '#6b7280';
  const gridColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';

  const option = {
    grid: {
      left: '10%',
      right: '10%',
      top: '15%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: times,
      axisLabel: {
        color: textColor,
        fontSize: 10,
        rotate: 45,
      },
      axisLine: {
        lineStyle: {
          color: gridColor,
        },
      },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Suhu (°C)',
        nameTextStyle: {
          color: textColor,
          fontSize: 11,
        },
        axisLabel: {
          color: textColor,
          fontSize: 10,
        },
        axisLine: {
          lineStyle: {
            color: gridColor,
          },
        },
        splitLine: {
          lineStyle: {
            color: gridColor,
            opacity: 0.3,
          },
        },
      },
      {
        type: 'value',
        name: 'Kelembapan (%)',
        nameTextStyle: {
          color: textColor,
          fontSize: 11,
        },
        axisLabel: {
          color: textColor,
          fontSize: 10,
        },
        axisLine: {
          lineStyle: {
            color: gridColor,
          },
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: 'Suhu',
        type: 'line',
        data: temps,
        smooth: true,
        yAxisIndex: 0,
        itemStyle: {
          color: COLORS.chart.temperature,
        },
        lineStyle: {
          width: 3,
        },
        symbol: 'circle',
        symbolSize: 6,
      },
      {
        name: 'Kelembapan',
        type: 'line',
        data: humidities,
        smooth: true,
        yAxisIndex: 1,
        itemStyle: {
          color: COLORS.chart.humidity,
        },
        lineStyle: {
          width: 2,
          type: 'dashed',
        },
        areaStyle: {
          color: COLORS.chart.humidity,
          opacity: 0.2,
        },
        symbol: 'circle',
        symbolSize: 4,
      },
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#ffffff',
      borderColor: gridColor,
      textStyle: {
        color: textColor,
      },
    },
  };

  // Fallback for web or when ECharts is not available
  if (Platform.OS === 'web' || !EChartsComponent) {
    return (
      <View>
        <View className="rounded-lg bg-muted p-4">
          <Text className="mb-2 text-center" size="sm" variant="muted">
            Grafik suhu dan kelembapan
          </Text>
          <View className="gap-1">
            {data.slice(0, 6).map((d, i) => (
              <View key={i} className="flex-row justify-between">
                <Text size="sm">{d.time}</Text>
                <Text size="sm">
                  {d.temp}°C · {d.humidity}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View>
      <View style={{ height: 220 }}>
        <EChartsComponent option={option} width={screenWidth - 32} height={220} />
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
