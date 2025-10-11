import { Platform } from 'react-native';

// Conditionally import Animated only for native platforms
let Animated: any;
if (Platform.OS !== 'web') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Animated = require('react-native-reanimated').default;
  } catch {
    console.warn('Reanimated not available');
  }
}

/**
 * This component is used to wrap animated views that should only be animated on native.
 * @param props - The props for the animated view.
 * @returns The animated view if the platform is native, otherwise the children.
 * @example
 * <NativeOnlyAnimatedView entering={FadeIn} exiting={FadeOut}>
 *   <Text>I am only animated on native</Text>
 * </NativeOnlyAnimatedView>
 */
function NativeOnlyAnimatedView(props: React.ComponentProps<any> & React.RefAttributes<any>) {
  if (Platform.OS === 'web') {
    return <>{props.children as React.ReactNode}</>;
  } else {
    return Animated ? <Animated.View {...props} /> : <>{props.children as React.ReactNode}</>;
  }
}

export { NativeOnlyAnimatedView };
