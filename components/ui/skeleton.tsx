import * as React from 'react';
import { View, Platform, Animated } from 'react-native';
import { cn } from '~/lib/utils';

interface SkeletonProps extends React.ComponentPropsWithoutRef<typeof View> {
  className?: string;
}

const Skeleton = React.forwardRef<React.ElementRef<typeof View>, SkeletonProps>(
  ({ className, ...props }, ref) => {
    const opacity = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ])
      ).start();
    }, [opacity]);

    return (
      <Animated.View
        ref={ref}
        style={{ opacity }}
        className={cn('rounded-md bg-muted', className)}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
