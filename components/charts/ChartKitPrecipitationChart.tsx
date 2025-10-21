import React, { useState, useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Text } from '~/components/ui/text';
import { COLORS, getThemeColor } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';
import { useBreakpoint } from '~/lib/breakpoints';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { useWeatherStore } from '~/store/weatherStore';

const PopoverAny: any = Popover as any;
const PopoverTriggerAny: any = PopoverTrigger as any;
const PopoverContentAny: any = PopoverContent as any;

interface PrecipitationChartData {
  time: string;
  precipitation: number;
}

interface PrecipitationChartProps {
  data?: PrecipitationChartData[];
  adm4Code?: string;
  width?: number;
  height?: number;
  animated?: boolean;
}

export function ChartKitPrecipitationChart({
  data: propData,
  adm4Code,
  width: propWidth,
  height: propHeight = 200,
}: PrecipitationChartProps) {
  const { colorScheme } = useTheme();
  const { isDesktop } = useBreakpoint();
  const { width: windowWidth } = useWindowDimensions();
  const { forecast, loading, fetchWeatherData } = useWeatherStore();

  // Fetch data when adm4Code is provided
  useEffect(() => {
    if (adm4Code) {
      fetchWeatherData(adm4Code);
    }
  }, [adm4Code, fetchWeatherData]);

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
  let chartData: PrecipitationChartData[] = [];
  
  if (propData) {
    // Use provided data (backward compatible)
    chartData = propData;
  } else if (forecast && forecast.length > 0) {
    // Use first 8 data points from forecast
    const allForecasts = forecast.flat();
    const next24Hours = allForecasts.slice(0, 8);

    chartData = next24Hours.map(item => ({
      time: new Date(item.datetime).toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      // Note: BMKG API doesn't provide precipitation data directly
      // Using cloud coverage as a proxy (0-100% -> 0-10mm scale)
      precipitation: Math.round(item.cloudCover / 10),
    }));
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
        <Text variant="muted">Tidak ada data cuaca</Text>
      </View>
    );
  }

  // Prepare chart data
  const labels = chartData.map((d) => d.time);
  const precipitations = chartData.map((d) => d.precipitation);

  // Colors (theme-aware)
  const precipColor = themeColors.chart?.precipitation ?? COLORS.chart.precipitation;

  const chartConfig = {
    backgroundColor: themeColors.card,
    backgroundGradientFrom: themeColors.card,
    backgroundGradientTo: themeColors.card,
    decimalPlaces: 0,
  color: (opacity = 1) => precipColor,
    labelColor: (opacity = 1) => themeColors.muted,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: themeColors.border,
      strokeWidth: 1,
      strokeOpacity: 0.2,
    },
  };

  const barChartData = {
    labels: labels,
    datasets: [
      {
        data: precipitations.length > 0 ? precipitations : [0],
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
      <BarChart
        data={barChartData}
        width={width}
        height={propHeight}
        chartConfig={chartConfig}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        yAxisLabel=""
        yAxisSuffix=""
        withInnerLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={true}
        showBarTops={false}
        showValuesOnTopOfBars={false}
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
              <Text className="font-semibold">Detail Curah Hujan</Text>
              <View className="flex-row justify-between">
                <Text variant="muted" size="sm">Waktu:</Text>
                <Text size="sm" className="font-medium">{chartData[selectedDataPoint.index]?.time}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text variant="muted" size="sm">Curah Hujan:</Text>
                <Text size="sm" className="font-medium">{chartData[selectedDataPoint.index]?.precipitation} mm</Text>
              </View>
            </View>
          </PopoverContentAny>
        </PopoverAny>
      )}

      {/* Legend */}
      <View className="mt-2 flex-row justify-center">
        <View className="flex-row items-center gap-2">
          <View
            className="h-3 w-3 rounded"
            style={{ backgroundColor: precipColor }}
          />
          <Text size="sm" variant="muted">
            Curah Hujan (mm)
          </Text>
        </View>
      </View>
    </View>
  );
}
