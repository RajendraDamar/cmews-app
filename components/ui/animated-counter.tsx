import React, { useEffect, useState, useRef } from 'react';
import { Text as RNText, TextStyle, StyleProp, Platform } from 'react-native';
import { cn } from '~/lib/utils';
import { useTheme } from '~/lib/theme-provider';

interface AnimatedCounterProps {
  /** Target numeric value */
  value: number;
  /** Duration of animation in ms */
  duration?: number;
  /** Decimal places (0 for integers) */
  decimals?: number;
  /** Optional prefix text */
  prefix?: string;
  /** Optional suffix text (e.g. "°", "%", " km/h") */
  suffix?: string;
  /** Custom class names */
  className?: string;
  /** Custom text styles */
  style?: StyleProp<TextStyle>;
  /** Whether to animate on initial mount */
  animateInitial?: boolean;
}

/**
 * Cross-platform animated numeric counter.
 * Smoothly interpolates from previous to next value using ease-out cubic curve.
 */
export function AnimatedCounter({
  value,
  duration = 450,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  style,
  animateInitial = false,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState<number>(() =>
    animateInitial ? 0 : value
  );
  const prevValueRef = useRef<number>(animateInitial ? 0 : value);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = value;

    if (startValue === endValue) {
      setDisplayValue(endValue);
      return;
    }

    const startTime = Date.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const update = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = startValue + (endValue - startValue) * easedProgress;

      setDisplayValue(current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(update);
      } else {
        setDisplayValue(endValue);
        prevValueRef.current = endValue;
      }
    };

    animFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [value, duration]);

  const formattedNumber =
    decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue).toString();

  const { colorScheme } = useTheme();

  return (
    <RNText
      className={cn('tabular-nums font-semibold', className)}
      style={
        Platform.OS !== 'web'
          ? [
              {
                color: colorScheme === 'dark' ? '#f3f4f6' : '#1f2937',
              },
              style,
            ]
          : style
      }>
      {prefix}
      {formattedNumber}
      {suffix}
    </RNText>
  );
}
