import React, { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Text } from '~/components/ui/text';
import { COLORS, getThemeColor } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';
import { useBreakpoint } from '~/lib/breakpoints';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';

interface TemperatureChartData {
  time: string;
  temp: number;
  humidity: number;
}

interface TemperatureChartProps {
  data: TemperatureChartData[];
  width?: number;
  height?: number;
  animated?: boolean;
}

export function ChartKitTemperatureChart({
  data,
  width: propWidth,
  height: propHeight = 220,
}: TemperatureChartProps) {
  const { colorScheme } = useTheme();
  const { isDesktop } = useBreakpoint();
  const { width: windowWidth } = useWindowDimensions();
  
  // Calculate responsive width
  // For desktop: use max container width (similar to forecast tab max-w-4xl = 896px), minus padding
  // For mobile: use screen width minus padding
  const responsiveWidth = propWidth || (isDesktop ? Math.min(windowWidth, 896) - 64 : windowWidth - 32);
  const width = responsiveWidth;
  
  const [selectedDataPoint, setSelectedDataPoint] = useState<{ index: number; value: number; dataset: number } | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const themeColors = getThemeColor(colorScheme === 'dark');

  // Prepare chart data
  const labels = data.map((d) => d.time);
  const temperatures = data.map((d) => d.temp);
  const humidities = data.map((d) => d.humidity);

  // Colors
  const tempColor = COLORS.chart.temperature;
  const humidityColor = COLORS.chart.humidity;

  const chartConfig = {
    backgroundColor: themeColors.card,
    backgroundGradientFrom: themeColors.card,
    backgroundGradientTo: themeColors.card,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // Temperature color
    labelColor: (opacity = 1) => themeColors.muted,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: tempColor,
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // solid line
      stroke: themeColors.border,
      strokeWidth: 1,
      strokeOpacity: 0.2,
    },
  };

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: temperatures,
        color: (opacity = 1) => tempColor,
        strokeWidth: 3,
      },
      {
        data: humidities,
        color: (opacity = 1) => humidityColor,
        strokeWidth: 2,
      },
    ],
  };

  const handleDataPointClick = (dataPointClickData: any) => {
    const { index, value, dataset } = dataPointClickData;
    setSelectedDataPoint({ index, value, dataset });
    setPopoverOpen(true);
  };

  return (
    <View>
      <LineChart
        data={chartData}
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
        fromZero={false}
        onDataPointClick={handleDataPointClick}
      />

      {/* Popup for data point details */}
      {selectedDataPoint !== null && 
       selectedDataPoint.index >= 0 && 
       selectedDataPoint.index < data.length && (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <View />
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <View className="gap-2">
              <Text className="font-semibold">Detail Cuaca</Text>
              <View className="flex-row justify-between">
                <Text variant="muted" size="sm">Waktu:</Text>
                <Text size="sm" className="font-medium">{data[selectedDataPoint.index]?.time}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text variant="muted" size="sm">
                  {selectedDataPoint.dataset === 0 ? 'Suhu:' : 'Kelembapan:'}
                </Text>
                <Text size="sm" className="font-medium">
                  {selectedDataPoint.dataset === 0 
                    ? `${data[selectedDataPoint.index]?.temp}°C`
                    : `${data[selectedDataPoint.index]?.humidity}%`
                  }
                </Text>
              </View>
            </View>
          </PopoverContent>
        </Popover>
      )}

      {/* Legend */}
      <View className="mt-2 flex-row justify-center gap-6">
        <View className="flex-row items-center gap-2">
          <View
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: tempColor }}
          />
          <Text size="sm" variant="muted">
            Suhu (°C)
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: humidityColor }}
          />
          <Text size="sm" variant="muted">
            Kelembapan (%)
          </Text>
        </View>
      </View>
    </View>
  );
}
