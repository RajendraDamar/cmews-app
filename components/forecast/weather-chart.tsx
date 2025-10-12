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

interface ChartDataPoint {
  time: string;
  temp: number;
  humidity: number;
}

interface WeatherChartProps {
  data: ChartDataPoint[];
}

export function WeatherChart({ data }: WeatherChartProps) {
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
      top: '10%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: times,
      axisLabel: {
        color: textColor,
        fontSize: 9,
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
        axisLabel: {
          color: textColor,
          fontSize: 9,
        },
        axisLine: {
          lineStyle: {
            color: gridColor,
          },
        },
        splitLine: {
          lineStyle: {
            color: gridColor,
            opacity: 0.2,
          },
        },
      },
    ],
    series: [
      {
        name: 'Suhu',
        type: 'line',
        data: temps,
        smooth: true,
        itemStyle: {
          color: COLORS.chart.temperature,
        },
        lineStyle: {
          width: 2,
        },
        symbol: 'circle',
        symbolSize: 5,
      },
      {
        name: 'Kelembapan',
        type: 'line',
        data: humidities,
        smooth: true,
        itemStyle: {
          color: COLORS.chart.humidity,
        },
        areaStyle: {
          color: COLORS.chart.humidity,
          opacity: 0.2,
        },
        lineStyle: {
          width: 2,
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
      <View className="rounded-lg bg-muted p-4">
        <Text className="mb-2 text-center" size="sm" variant="muted">
          Grafik cuaca
        </Text>
        <View className="gap-1">
          {data.slice(0, 5).map((d, i) => (
            <View key={i} className="flex-row justify-between">
              <Text size="sm">{d.time}</Text>
              <Text size="sm">
                {d.temp}°C · {d.humidity}%
              </Text>
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
