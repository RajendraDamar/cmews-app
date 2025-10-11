import React from 'react';
import { View, Platform } from 'react-native';
import { ArrowUp } from 'lucide-react-native';
import { Text } from '~/components/ui/text';
import { DIRECTION_MAP } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';

// Conditionally import Animated only for native platforms
let Animated: any = View;
if (Platform.OS !== 'web') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Animated = require('react-native-reanimated').default;
  } catch {
    console.warn('Reanimated not available, falling back to View');
    Animated = View;
  }
}

interface DirectionArrowProps {
  direction: string;
  degrees?: number;
  size?: number;
  showLabel?: boolean;
}

export function DirectionArrow({
  direction,
  degrees,
  size = 20,
  showLabel = false,
}: DirectionArrowProps) {
  const { colorScheme } = useTheme();
  const rotation = degrees ?? DIRECTION_MAP[direction] ?? 0;
  const iconColor = colorScheme === 'dark' ? '#e5e7eb' : '#1f2937';

  // Use Platform.OS check to avoid worklets on web
  const AnimatedContainer = Platform.OS === 'web' ? View : Animated.View;

  return (
    <View className="items-center gap-1">
      <AnimatedContainer
        style={{
          transform: [{ rotate: `${rotation}deg` }],
        }}>
        <ArrowUp size={size} color={iconColor} />
      </AnimatedContainer>
      {showLabel && (
        <Text size="sm" variant="muted">
          {direction}
        </Text>
      )}
    </View>
  );
}
