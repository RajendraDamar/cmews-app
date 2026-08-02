import React, { useState, useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Text } from '~/components/ui/text';
import { COLORS, getThemeColor } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';
import { useBreakpoint } from '~/lib/breakpoints';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { useWeatherStore } from '~/store/weatherStore';

const PopoverAny: any = Popover as any;
const PopoverTriggerAny: any = PopoverTrigger as any;
const PopoverContentAny: any = PopoverContent as any;

interface WaveChartData {
  time: string;
  height: number;
  period?: number;
}

interface WaveChartProps {
  data?: WaveChartData[];
  adm4Code?: string;
  width?: number;
  height?: number;
  animated?: boolean;
}

export function ChartKitWaveChart({
  data: propData,
  adm4Code,
  width: propWidth,
  height: propHeight = 200,
}: WaveChartProps) {
  const { colorScheme } = useTheme();
  const { isDesktop } = useBreakpoint();
  const { width: windowWidth } = useWindowDimensions();
  const { maritimeWeather, loading, fetchMaritimeData } = useWeatherStore();

  // Fetch maritime data when adm4Code is provided
  useEffect(() => {
    if (adm4Code) {
      fetchMaritimeData();
    }
  }, [adm4Code, fetchMaritimeData]);

  const [containerWidth, setContainerWidth] = React.useState<number>(0);

  const width =
    propWidth ||
    (containerWidth > 0
      ? containerWidth
      : isDesktop
      ? Math.min(windowWidth, 896) - 64
      : windowWidth - 32);
  
  const [selectedDataPoint, setSelectedDataPoint] = useState<{ index: number; value: number; dataset: number } | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const themeColors = getThemeColor(colorScheme === 'dark');

  // Transform real data or use prop data for backward compatibility
  let chartData: WaveChartData[] = [];
  
  if (propData) {
    // Use provided data (backward compatible)
    chartData = propData;
  } else if (maritimeWeather && maritimeWeather.length > 0) {
    // Use maritime weather data
    // Note: BMKG maritime API provides wave height as string like "1.25 - 2.5 m"
    chartData = maritimeWeather.slice(0, 8).map((item: any, index: number) => {
      const waveHeightStr = item.tinggi_gelombang || '0';
      // Extract first number from string like "1.25 - 2.5 m"
      const heightMatch = waveHeightStr.match(/[\d.]+/);
      const height = heightMatch ? parseFloat(heightMatch[0]) : 1.5;
      
      return {
        time: `${String(index * 3).padStart(2, '0')}:00`,
        height: height,
        period: undefined,
      };
    });
  }

  // Show loading state
  if (!propData && loading) {
    return (
      <View className="flex items-center justify-center" style={{ height: propHeight }}>
        <Text>Memuat data cuaca...</Text>
      </View>
    );
  }

  // Show empty state if no data
  if (chartData.length === 0) {
    return (
      <View className="flex items-center justify-center" style={{ height: propHeight }}>
        <Text variant="muted">Tidak ada data gelombang</Text>
      </View>
    );
  }

  // Prepare chart data
  const labels = chartData.map((d) => d.time);
  const heights = chartData.map((d) => d.height);

  // Colors (theme-aware)
  const waveColor = themeColors.chart?.wind ?? COLORS.chart.wind; // Using teal color for waves
  
  
  

  const chartConfig = {
    backgroundColor: themeColors.card,
    backgroundGradientFrom: themeColors.card,
    backgroundGradientTo: themeColors.card,
    decimalPlaces: 1,
    color: (opacity = 1) => waveColor,
    labelColor: (opacity = 1) => themeColors.muted,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: waveColor,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: themeColors.border,
      strokeWidth: 1,
      strokeOpacity: 0.2,
    },
  };

  const lineChartData = {
    labels: labels,
    datasets: [
      {
        data: heights.length > 0 ? heights : [0],
        color: (opacity = 1) => waveColor,
        strokeWidth: 3,
      },
    ],
  };

  const handleDataPointClick = (dataPointClickData: any) => {
    const { index, value, dataset } = dataPointClickData;
    setSelectedDataPoint({ index, value, dataset });
    setPopoverOpen(true);
  };

  return (
  <View onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      <LineChart
        data={lineChartData}
        width={width}
        height={propHeight}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        withDots={true}
        withShadow={false}
        fromZero={true}
        // @ts-ignore: react-native-chart-kit typing may not include onDataPointClick
        onDataPointClick={handleDataPointClick}
      />

      {/* Popup for data point details */}
      {selectedDataPoint !== null && 
       selectedDataPoint.index >= 0 && 
       selectedDataPoint.index < chartData.length && (
        <PopoverAny open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTriggerAny asChild>
            <View />
          </PopoverTriggerAny>
          <PopoverContentAny className="w-48">
            <View className="gap-2">
              <Text className="font-semibold">Detail Gelombang</Text>
              <View className="flex-row justify-between">
                <Text variant="muted" size="sm">Waktu:</Text>
                <Text size="sm" className="font-medium">{chartData[selectedDataPoint.index]?.time}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text variant="muted" size="sm">Tinggi:</Text>
                <Text size="sm" className="font-medium">{chartData[selectedDataPoint.index]?.height} m</Text>
              </View>
            </View>
          </PopoverContentAny>
        </PopoverAny>
      )}

      {/* Legend */}
      <View className="mt-2 flex-row justify-center">
        <View className="flex-row items-center gap-2">
          <View
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: waveColor }}
          />
          <Text size="sm" variant="muted">
            Tinggi Gelombang (m)
          </Text>
        </View>
      </View>
    </View>
  );
}
