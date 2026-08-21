import * as React from 'react';
import { View, Platform, StyleProp, ViewStyle } from 'react-native';
import { cn } from '~/lib/utils';

let ReanimatedAnimated: any = null;
let FadeInDown: any;
if (Platform.OS !== 'web') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Reanimated = require('react-native-reanimated');
    ReanimatedAnimated = Reanimated.default;
    FadeInDown = Reanimated.FadeInDown;
  } catch {
    console.warn('Reanimated not available for PageTransition');
  }
}

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function PageTransition({ children, className, style }: PageTransitionProps) {
  if (Platform.OS === 'web') {
    return (
      <View
        className={cn(
          'flex-1 animate-in fade-in-0 slide-in-from-bottom-2 duration-200 ease-out',
          className
        )}
        style={style}>
        {children}
      </View>
    );
  }

  if (ReanimatedAnimated && FadeInDown) {
    return (
      <ReanimatedAnimated.View
        entering={FadeInDown.duration(220).springify().damping(18)}
        style={[{ flex: 1 }, style]}
        className={className}>
        {children}
      </ReanimatedAnimated.View>
    );
  }

  return (
    <View style={[{ flex: 1 }, style]} className={className}>
      {children}
    </View>
  );
}
