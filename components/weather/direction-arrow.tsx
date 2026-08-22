import React, { useEffect, useRef, useState } from 'react';
import { View, Platform, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { ArrowUp } from 'lucide-react-native';
import { Text } from '~/components/ui/text';
import { DIRECTION_MAP, getThemeColor } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';

/**
 * Calculates shortest-arc angular distance to avoid full 360 flip glitch
 */
function getShortestArcAngle(currentAngle: number, targetAngle: number): number {
  const diff = (((targetAngle - (currentAngle % 360)) + 540) % 360) - 180;
  return currentAngle + diff;
}

interface DirectionArrowProps {
  direction: string;
  degrees?: number;
  size?: number;
  color?: string;
  showLabel?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

function NativeRotator({
  targetAngle,
  size,
  color,
}: {
  targetAngle: number;
  size: number;
  color: string;
}) {
  const currentAngle = useSharedValue(targetAngle);

  useEffect(() => {
    const nextAngle = getShortestArcAngle(currentAngle.value, targetAngle);
    currentAngle.value = withSpring(nextAngle, {
      damping: 14,
      stiffness: 110,
      mass: 0.9,
    });
  }, [targetAngle, currentAngle]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${currentAngle.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <ArrowUp size={size} color={color} />
    </Animated.View>
  );
}

export function DirectionArrow({
  direction,
  degrees,
  size = 20,
  color,
  showLabel = false,
  className,
  style,
}: DirectionArrowProps) {
  const { colorScheme } = useTheme();
  const rawTarget = degrees ?? DIRECTION_MAP[direction] ?? 0;
  const themeColors = getThemeColor(colorScheme === 'dark');
  const arrowColor = color ?? themeColors.icon.foreground;

  // Web shortest-arc angle tracking
  const [webAngle, setWebAngle] = useState(rawTarget);
  const prevAngleRef = useRef(rawTarget);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const next = getShortestArcAngle(prevAngleRef.current, rawTarget);
      prevAngleRef.current = next;
      setWebAngle(next);
    }
  }, [rawTarget]);

  return (
    <View className="items-center gap-1" style={style}>
      {Platform.OS === 'web' ? (
        <View
          className="items-center justify-center web:transition-transform web:duration-500 web:ease-out"
          style={{
            transform: [{ rotate: `${webAngle}deg` }],
          }}>
          <ArrowUp size={size} color={arrowColor} />
        </View>
      ) : (
        <NativeRotator
          targetAngle={rawTarget}
          size={size}
          color={arrowColor}
        />
      )}
      {showLabel && (
        <Text size="sm" variant="muted">
          {direction}
        </Text>
      )}
    </View>
  );
}
