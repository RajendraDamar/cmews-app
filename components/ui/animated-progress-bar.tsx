import React, { useEffect } from 'react';
import { View, ViewStyle, StyleProp, Platform, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '~/lib/theme-provider';
import { getThemeColor } from '~/lib/constants';
import { cn } from '~/lib/utils';

interface AnimatedProgressBarProps {
  /** Current value */
  value: number;
  /** Max value (default: 100) */
  max?: number;
  /** Custom class for outer track */
  className?: string;
  /** Custom class for inner progress fill */
  indicatorClassName?: string;
  /** Custom inline style for inner progress fill */
  indicatorStyle?: StyleProp<ViewStyle>;
  /** Custom track style */
  style?: StyleProp<ViewStyle>;
}

/**
 * Native indicator bar powered by Reanimated spring worklet
 */
function NativeIndicator({
  percent,
  style,
}: {
  percent: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { colorScheme } = useTheme();
  const themeColors = getThemeColor(colorScheme === 'dark');
  const widthVal = useSharedValue(percent);

  useEffect(() => {
    widthVal.value = withSpring(percent, {
      damping: 18,
      stiffness: 120,
      mass: 0.8,
    });
  }, [percent, widthVal]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${Math.min(Math.max(widthVal.value, 0), 100)}%`,
  }));

  return (
    <Animated.View
      style={[
        {
          height: '100%',
          borderRadius: 9999,
          backgroundColor: themeColors.primary,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

/**
 * Cross-platform animated progress bar.
 * Uses hardware-accelerated CSS transitions on Web, Reanimated spring physics on Native.
 */
export function AnimatedProgressBar({
  value,
  max = 100,
  className,
  indicatorClassName,
  indicatorStyle,
  style,
}: AnimatedProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  if (Platform.OS === 'web') {
    return (
      <View
        className={cn('h-2 w-full overflow-hidden rounded-full bg-secondary', className)}
        style={style}>
        <View
          className={cn(
            'h-full rounded-full bg-primary web:transition-all web:duration-500 web:ease-out',
            indicatorClassName
          )}
          style={StyleSheet.flatten([{ width: `${percentage}%` }, indicatorStyle])}
        />
      </View>
    );
  }

  return (
    <View
      className={cn('h-2 w-full overflow-hidden rounded-full bg-secondary', className)}
      style={style}>
      <NativeIndicator
        percent={percentage}
        style={indicatorStyle}
      />
    </View>
  );
}
