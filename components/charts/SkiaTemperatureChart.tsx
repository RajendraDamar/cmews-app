import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import { Canvas, Path, Circle, Text as SkiaText, vec, LinearGradient } from '@shopify/react-native-skia';
import { useSharedValue, withTiming, useDerivedValue } from 'react-native-reanimated';
import { scaleLinear } from 'd3-scale';
import { Text } from '~/components/ui/text';
import { COLORS, getThemeColor } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';
import { createSmoothPath, createAreaPath, type DataPoint } from './utils';

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

export function SkiaTemperatureChart({
  data,
  width: propWidth,
  height: propHeight = 220,
  animated = true,
}: TemperatureChartProps) {
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

  // Convert data to points
  const tempPoints: DataPoint[] = data.map((d, i) => ({
    x: i,
    y: d.temp,
  }));

  const humidityPoints: DataPoint[] = data.map((d, i) => ({
    x: i,
    y: d.humidity,
  }));

  // Calculate scales
  const xScale = scaleLinear()
    .domain([0, data.length - 1])
    .range([padding.left, padding.left + chartWidth]);

  const tempValues = data.map((d) => d.temp);
  const tempMin = Math.min(...tempValues);
  const tempMax = Math.max(...tempValues);
  const tempPadding = (tempMax - tempMin) * 0.1;

  const tempScale = scaleLinear()
    .domain([tempMin - tempPadding, tempMax + tempPadding])
    .range([padding.top + chartHeight, padding.top]);

  const humidityValues = data.map((d) => d.humidity);
  const humidityMin = Math.min(...humidityValues);
  const humidityMax = Math.max(...humidityValues);
  const humidityPadding = (humidityMax - humidityMin) * 0.1;

  const humidityScale = scaleLinear()
    .domain([humidityMin - humidityPadding, humidityMax + humidityPadding])
    .range([padding.top + chartHeight, padding.top]);

  // Create paths
  const tempPath = useDerivedValue(() => {
    const path = createSmoothPath(tempPoints, width, propHeight, padding);
    return path;
  }, [tempPoints, width, propHeight]);

  const humidityPath = useDerivedValue(() => {
    return createSmoothPath(humidityPoints, width, propHeight, padding);
  }, [humidityPoints, width, propHeight]);

  const humidityAreaPath = useDerivedValue(() => {
    return createAreaPath(humidityPoints, width, propHeight, padding);
  }, [humidityPoints, width, propHeight]);

  // Colors
  const themeColors = getThemeColor(colorScheme === 'dark');
  const tempColor = themeColors.chart?.temperature ?? COLORS.chart.temperature;
  const humidityColor = themeColors.chart?.humidity ?? COLORS.chart.humidity;
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

        {/* Humidity area (gradient fill) */}
        <Path
          path={humidityAreaPath}
          opacity={animationProgress}
        >
          <LinearGradient
            start={vec(0, padding.top)}
            end={vec(0, padding.top + chartHeight)}
            colors={[`${humidityColor}40`, `${humidityColor}10`]}
          />
        </Path>

        {/* Humidity line */}
        <Path
          path={humidityPath}
          color={humidityColor}
          style="stroke"
          strokeWidth={2}
          strokeCap="round"
          strokeJoin="round"
          opacity={animationProgress}
        />

        {/* Temperature line */}
        <Path
          path={tempPath}
          color={tempColor}
          style="stroke"
          strokeWidth={3}
          strokeCap="round"
          strokeJoin="round"
          opacity={animationProgress}
        />

        {/* Data points for temperature */}
        {data.map((d, i) => {
          const cx = xScale(i);
          const cy = tempScale(d.temp);
          return (
            <Circle
              key={`temp-point-${i}`}
              cx={cx}
              cy={cy}
              r={4}
              color={tempColor}
              opacity={animationProgress}
            />
          );
        })}

        {/* Data points for humidity */}
        {data.map((d, i) => {
          const cx = xScale(i);
          const cy = humidityScale(d.humidity);
          return (
            <Circle
              key={`humidity-point-${i}`}
              cx={cx}
              cy={cy}
              r={3}
              color={humidityColor}
              opacity={animationProgress}
            />
          );
        })}

        {/* Y-axis labels - Temperature */}
        {[0, 1, 2, 3, 4].map((i) => {
          const value = tempMin + ((tempMax - tempMin) / 4) * (4 - i);
          const y = padding.top + (chartHeight / 4) * i;
          return (
            <SkiaText
                key={`temp-label-${i}`}
                x={padding.left - 8}
                y={y + 4}
                text={`${Math.round(value)}°`}
                color={textColor}
                // font typing expects SkFont; cast literal to any to preserve runtime intent
                font={{ size: 10 } as any}
              />
          );
        })}

        {/* X-axis labels */}
        {data.map((d, i) => {
          if (i % Math.ceil(data.length / 6) !== 0) return null;
          const x = xScale(i);
          return (
            <SkiaText
                key={`x-label-${i}`}
                x={x}
                y={padding.top + chartHeight + 20}
                text={d.time}
                color={textColor}
                font={{ size: 9 } as any}
              />
          );
        })}
      </Canvas>

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
