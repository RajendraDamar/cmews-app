import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { Card } from '~/components/ui/card';
import { ViewProps } from 'react-native';

interface AnimatedCardProps extends ViewProps {
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

export function AnimatedCard({ delay = 0, children, className, ...props }: AnimatedCardProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 400 }));
  }, [delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Card className={className} {...props}>
        {children}
      </Card>
    </Animated.View>
  );
}
