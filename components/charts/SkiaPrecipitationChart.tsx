import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import { Canvas, Path, RoundedRect, Text as SkiaText } from '@shopify/react-native-skia';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { scaleLinear } from 'd3-scale';
import { Text } from '~/components/ui/text';
import { COLORS, getThemeColor } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';

interface PrecipitationChartData {
  time: string;
  precipitation: number;
}

interface PrecipitationChartProps {
  data: PrecipitationChartData[];
  width?: number;
  height?: number;
  animated?: boolean;
}

export function SkiaPrecipitationChart({
  data,
  width: propWidth,
  height: propHeight = 200,
  animated = true,
}: PrecipitationChartProps) {
  const { colorScheme } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const width = propWidth || screenWidth - 32;

  // Animation progress
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      animationProgress.value = withTiming(1, { duration: 1200 });
    } else {
      animationProgress.value = 1;
    }
  }, [data, animated, animationProgress]);

  // Chart dimensions
  const padding = { top: 30, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = propHeight - padding.top - padding.bottom;

  // Calculate bar width
  const barCount = data.length;
  const spacing = 8;
  const totalSpacing = spacing * (barCount + 1);
  const barWidth = (chartWidth - totalSpacing) / barCount;

  // Calculate scales
  const precipValues = data.map((d) => d.precipitation);
  const maxPrecip = Math.max(...precipValues, 10); // At least 10mm for scale

  const yScale = scaleLinear()
    .domain([0, maxPrecip * 1.1])
    .range([padding.top + chartHeight, padding.top]);

  // Colors
  const themeColors = getThemeColor(colorScheme === 'dark');
  const precipColor = themeColors.chart?.precipitation ?? COLORS.chart.precipitation;
  const textColor = colorScheme === 'dark' ? '#9ca3af' : '#6b7280';
  const gridColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';

  return (
    <View>
      <Canvas style={{ width, height: propHeight }}>
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => {
          const y = padding.top + (chartHeight / 4) * i;
          return (
            <Path
              key={`grid-${i}`}
              path={`M ${padding.left} ${y} L ${padding.left + chartWidth} ${y}`}
              color={gridColor}
              style="stroke"
              strokeWidth={1}
              opacity={0.2}
            />
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const x = padding.left + spacing + i * (barWidth + spacing);
          const barHeight = (padding.top + chartHeight) - yScale(d.precipitation);
          const animatedY = padding.top + chartHeight - barHeight * animationProgress.value;
          const animatedHeight = barHeight * animationProgress.value;

          return (
            <RoundedRect
              key={`bar-${i}`}
              x={x}
              y={animatedY}
              width={barWidth}
              height={animatedHeight}
              r={4}
              color={precipColor}
            />
          );
        })}

        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4].map((i) => {
          const value = (maxPrecip * 1.1 / 4) * (4 - i);
          const y = padding.top + (chartHeight / 4) * i;
          return (
            <SkiaText
              key={`label-${i}`}
              x={padding.left - 12}
              y={y + 4}
              text={`${Math.round(value)}`}
              color={textColor}
              font={{ size: 10 } as any}
            />
          );
        })}

        {/* X-axis labels */}
        {data.map((d, i) => {
          if (data.length > 10 && i % Math.ceil(data.length / 6) !== 0) return null;
          const x = padding.left + spacing + i * (barWidth + spacing) + barWidth / 2;
          return (
            <SkiaText
              key={`x-label-${i}`}
              x={x - 15}
              y={padding.top + chartHeight + 20}
              text={d.time}
              color={textColor}
              font={{ size: 9 } as any}
            />
          );
        })}

        {/* Y-axis title */}
        <SkiaText
          x={10}
          y={padding.top + chartHeight / 2}
          text="mm"
          color={textColor}
          font={{ size: 11 } as any}
        />
      </Canvas>

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
