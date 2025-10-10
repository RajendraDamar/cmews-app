import * as React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { cn } from '~/utils/cn';

interface SkeletonProps extends React.ComponentPropsWithoutRef<typeof View> {
  className?: string;
}

const Skeleton = React.forwardRef<React.ElementRef<typeof View>, SkeletonProps>(
  ({ className, ...props }, ref) => {
    const opacity = useSharedValue(1);

    React.useEffect(() => {
      opacity.value = withRepeat(
        withSequence(withTiming(0.5, { duration: 1000 }), withTiming(1, { duration: 1000 })),
        -1,
        false
      );
    }, [opacity]);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
      };
    });

    return (
      <Animated.View
        ref={ref}
        style={animatedStyle}
        className={cn('rounded-md bg-muted', className)}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
