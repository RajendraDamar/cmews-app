import * as React from 'react';
import { View, Platform, Animated } from 'react-native';
import { cn } from '~/lib/utils';

interface SkeletonProps extends React.ComponentPropsWithoutRef<typeof View> {
  className?: string;
  /** Whether to show diagonal shimmer beam on web */
  shimmer?: boolean;
}

const Skeleton = React.forwardRef<React.ElementRef<typeof View>, SkeletonProps>(
  ({ className, shimmer = true, style, ...props }, ref) => {
    const opacity = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
      if (Platform.OS !== 'web') {
        Animated.loop(
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.45,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    }, [opacity]);

    if (Platform.OS === 'web') {
      return (
        <View
          ref={ref}
          className={cn(
            'relative overflow-hidden rounded-md bg-muted/70',
            className
          )}
          style={style}
          {...props}>
          {shimmer && (
            <View
              className="absolute inset-0 -translate-x-full animate-shimmer"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.18) 50%, transparent 100%)',
              } as any}
            />
          )}
        </View>
      );
    }

    return (
      <View className={cn('overflow-hidden rounded-md bg-muted', className)} style={style} {...props}>
        <Animated.View
          ref={ref}
          style={[
            {
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(150, 150, 150, 0.15)',
              opacity,
            },
          ]}
        />
      </View>
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
