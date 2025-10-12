import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import { Canvas, Path, Circle, Text as SkiaText, vec, LinearGradient } from '@shopify/react-native-skia';
import { useSharedValue, withTiming, withRepeat } from 'react-native-reanimated';
import { scaleLinear } from 'd3-scale';
import { Text } from '~/components/ui/text';
import { COLORS } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';

interface WaveChartData {
  time: string;
  height: number;
  period?: number;
}

interface WaveChartProps {
  data: WaveChartData[];
  width?: number;
  height?: number;
  animated?: boolean;
}

export function SkiaWaveChart({
  data,
  width: propWidth,
  height: propHeight = 200,
  animated = true,
}: WaveChartProps) {
  const { colorScheme } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const width = propWidth || screenWidth - 32;

  // Animation progress for initial render
  const animationProgress = useSharedValue(0);
  // Wave animation for continuous motion
  const waveOffset = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      animationProgress.value = withTiming(1, { duration: 1200 });
      waveOffset.value = withRepeat(
        withTiming(1, { duration: 3000 }),
        -1,
        false
      );
    } else {
      animationProgress.value = 1;
    }
  }, [data, animated]);

  // Chart dimensions
  const padding = { top: 30, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = propHeight - padding.top - padding.bottom;

  // Calculate scales
  const xScale = scaleLinear()
    .domain([0, data.length - 1])
    .range([padding.left, padding.left + chartWidth]);

  const waveHeights = data.map((d) => d.height);
  const maxHeight = Math.max(...waveHeights, 2); // At least 2m for scale
  const minHeight = Math.min(...waveHeights, 0);

  const yScale = scaleLinear()
    .domain([minHeight, maxHeight * 1.2])
    .range([padding.top + chartHeight, padding.top]);

  // Colors
  const waveColor = COLORS.chart.wind; // Using teal color for waves
  const textColor = colorScheme === 'dark' ? '#9ca3af' : '#6b7280';
  const gridColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';

  // Create wave path with sine curve
  const createWavePath = (height: number, x: number, offset: number) => {
    const baseY = yScale(0);
    const targetY = yScale(height);
    const waveHeight = baseY - targetY;
    const amplitude = waveHeight / 2;
    const frequency = 3;
    const waveWidth = 40;

    const path = `M ${x - waveWidth / 2} ${baseY} ` +
      Array.from({ length: 20 }, (_, i) => {
        const progress = i / 19;
        const waveX = x - waveWidth / 2 + progress * waveWidth;
        const phase = progress * Math.PI * 2 * frequency + offset * Math.PI * 2;
        const waveY = baseY - amplitude - Math.sin(phase) * amplitude * 0.3;
        return `L ${waveX} ${waveY}`;
      }).join(' ');

    return path;
  };

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

        {/* Wave visualizations */}
        {data.map((d, i) => {
          const x = xScale(i);
          const baseY = yScale(0);
          const targetY = yScale(d.height);
          // Simplified wave representation without continuous animation
          const wavePath = createWavePath(d.height, x, 0);

          return (
            <React.Fragment key={`wave-${i}`}>
              {/* Wave fill */}
              <Path
                path={wavePath}
                opacity={0.6 * animationProgress.value}
              >
                <LinearGradient
                  start={vec(x, targetY)}
                  end={vec(x, baseY)}
                  colors={[`${waveColor}80`, `${waveColor}20`]}
                />
              </Path>
              
              {/* Wave stroke */}
              <Path
                path={wavePath}
                color={waveColor}
                style="stroke"
                strokeWidth={2}
                opacity={animationProgress}
              />

              {/* Height marker */}
              <Circle
                cx={x}
                cy={targetY}
                r={4}
                color={waveColor}
                opacity={animationProgress}
              />
            </React.Fragment>
          );
        })}

        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4].map((i) => {
          const value = maxHeight * 1.2 - (maxHeight * 1.2 / 4) * i;
          const y = padding.top + (chartHeight / 4) * i;
          return (
            <SkiaText
              key={`y-label-${i}`}
              x={padding.left - 8}
              y={y + 4}
              text={`${value.toFixed(1)}`}
              color={textColor}
              font={{ size: 10 }}
            />
          );
        })}

        {/* X-axis labels */}
        {data.map((d, i) => {
          if (data.length > 8 && i % Math.ceil(data.length / 6) !== 0) return null;
          const x = xScale(i);
          return (
            <SkiaText
              key={`x-label-${i}`}
              x={x - 15}
              y={padding.top + chartHeight + 20}
              text={d.time}
              color={textColor}
              font={{ size: 9 }}
            />
          );
        })}

        {/* Y-axis title */}
        <SkiaText
          x={10}
          y={padding.top + chartHeight / 2}
          text="m"
          color={textColor}
          font={{ size: 11 }}
        />
      </Canvas>

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
