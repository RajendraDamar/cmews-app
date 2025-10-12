import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import { Canvas, Circle, Path, Text as SkiaText } from '@shopify/react-native-skia';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { Text } from '~/components/ui/text';
import { COLORS } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';

interface WindChartData {
  direction: string;
  speed: number;
  directionDegrees: number;
}

interface WindChartProps {
  data: WindChartData[];
  width?: number;
  height?: number;
  animated?: boolean;
}

export function SkiaWindChart({
  data,
  width: propWidth,
  height: propHeight = 250,
  animated = true,
}: WindChartProps) {
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
  }, [data, animated]);

  // Chart dimensions
  const centerX = width / 2;
  const centerY = propHeight / 2;
  const radius = Math.min(width, propHeight) / 2 - 60;

  // Colors
  const windColor = COLORS.chart.wind;
  const textColor = colorScheme === 'dark' ? '#9ca3af' : '#6b7280';
  const circleColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';

  // Calculate max speed for scaling
  const maxSpeed = Math.max(...data.map((d) => d.speed), 10);

  // Convert degrees to radians
  const degToRad = (deg: number) => (deg * Math.PI) / 180;

  return (
    <View>
      <Canvas style={{ width, height: propHeight }}>
        {/* Background circles */}
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <Circle
            key={`circle-${scale}`}
            cx={centerX}
            cy={centerY}
            r={radius * scale}
            color={circleColor}
            style="stroke"
            strokeWidth={1}
            opacity={0.3}
          />
        ))}

        {/* Cardinal directions */}
        {[
          { label: 'U', angle: 0 },
          { label: 'T', angle: 90 },
          { label: 'S', angle: 180 },
          { label: 'B', angle: 270 },
        ].map(({ label, angle }) => {
          const rad = degToRad(angle - 90); // -90 to start from top
          const x = centerX + Math.cos(rad) * (radius + 25);
          const y = centerY + Math.sin(rad) * (radius + 25);
          return (
            <SkiaText
              key={`cardinal-${label}`}
              x={x - 8}
              y={y + 6}
              text={label}
              color={textColor}
              font={{ size: 14, weight: 'bold' }}
            />
          );
        })}

        {/* Wind direction indicators */}
        {data.map((d, i) => {
          const normalizedSpeed = d.speed / maxSpeed;
          const arrowLength = radius * normalizedSpeed;
          const rad = degToRad(d.directionDegrees - 90); // -90 to start from top

          const endX = centerX + Math.cos(rad) * arrowLength;
          const endY = centerY + Math.sin(rad) * arrowLength;

          // Arrow head
          const arrowHeadLength = 12;
          const arrowHeadAngle = 25;
          const leftRad = degToRad(d.directionDegrees - 90 - arrowHeadAngle);
          const rightRad = degToRad(d.directionDegrees - 90 + arrowHeadAngle);

          const leftX = endX - Math.cos(leftRad) * arrowHeadLength;
          const leftY = endY - Math.sin(leftRad) * arrowHeadLength;
          const rightX = endX - Math.cos(rightRad) * arrowHeadLength;
          const rightY = endY - Math.sin(rightRad) * arrowHeadLength;

          const opacity = 0.3 + 0.7 * animationProgress.value;

          return (
            <React.Fragment key={`wind-${i}`}>
              {/* Arrow line */}
              <Path
                path={`M ${centerX} ${centerY} L ${endX} ${endY}`}
                color={windColor}
                style="stroke"
                strokeWidth={3}
                strokeCap="round"
                opacity={opacity}
              />
              {/* Arrow head */}
              <Path
                path={`M ${leftX} ${leftY} L ${endX} ${endY} L ${rightX} ${rightY}`}
                color={windColor}
                style="stroke"
                strokeWidth={3}
                strokeCap="round"
                strokeJoin="round"
                opacity={opacity}
              />
            </React.Fragment>
          );
        })}

        {/* Center circle */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={8}
          color={windColor}
        />

        {/* Speed scale labels */}
        {[0.25, 0.5, 0.75, 1].map((scale, i) => {
          const speed = Math.round(maxSpeed * scale);
          return (
            <SkiaText
              key={`speed-${i}`}
              x={centerX + 5}
              y={centerY - radius * scale + 5}
              text={`${speed}`}
              color={textColor}
              font={{ size: 9 }}
            />
          );
        })}
      </Canvas>

      {/* Legend */}
      <View className="mt-2 flex-row justify-center gap-4 flex-wrap">
        {data.map((d, i) => (
          <View key={`legend-${i}`} className="flex-row items-center gap-1">
            <View
              className="h-2 w-8"
              style={{ backgroundColor: windColor }}
            />
            <Text size="xs" variant="muted">
              {d.direction}: {d.speed} km/h
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
