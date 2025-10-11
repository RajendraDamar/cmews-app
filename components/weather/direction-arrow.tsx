import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { ArrowUp } from 'lucide-react-native';
import { Text } from '~/components/ui/text';
import { DIRECTION_MAP } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';

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

  return (
    <View className="items-center gap-1">
      <Animated.View
        style={{
          transform: [{ rotate: `${rotation}deg` }],
        }}>
        <ArrowUp size={size} color={iconColor} />
      </Animated.View>
      {showLabel && (
        <Text size="sm" variant="muted">
          {direction}
        </Text>
      )}
    </View>
  );
}
