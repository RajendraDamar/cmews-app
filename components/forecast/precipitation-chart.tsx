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

interface PrecipitationChartData {
  time: string;
  precipitation: number;
}

interface PrecipitationChartProps {
  data: PrecipitationChartData[];
}

export function PrecipitationChart({ data }: PrecipitationChartProps) {
  const { colorScheme } = useTheme();
  const screenWidth = Dimensions.get('window').width;

  // Prepare chart data
  const times = data.map((d) => d.time);
  const precipitations = data.map((d) => d.precipitation);

  const textColor = colorScheme === 'dark' ? '#9ca3af' : '#6b7280';
  const gridColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';

  const option = {
    grid: {
      left: '10%',
      right: '5%',
      top: '10%',
      bottom: '20%',
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
    yAxis: {
      type: 'value',
      name: 'mm',
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
    series: [
      {
        name: 'Curah Hujan',
        type: 'bar',
        data: precipitations,
        itemStyle: {
          color: COLORS.chart.precipitation,
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: '60%',
      },
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#ffffff',
      borderColor: gridColor,
      textStyle: {
        color: textColor,
      },
      formatter: '{b}: {c} mm',
    },
  };

  // Fallback for web or when ECharts is not available
  if (Platform.OS === 'web' || !EChartsComponent) {
    return (
      <View className="rounded-lg bg-muted p-4">
        <Text className="mb-2 text-center" size="sm" variant="muted">
          Curah Hujan
        </Text>
        <View className="gap-1">
          {data.slice(0, 5).map((d, i) => (
            <View key={i} className="flex-row justify-between">
              <Text size="sm">{d.time}</Text>
              <Text size="sm">{d.precipitation} mm</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={{ height: 200 }}>
      <EChartsComponent option={option} width={screenWidth - 32} height={200} />
    </View>
  );
}
