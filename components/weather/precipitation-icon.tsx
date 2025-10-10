import React from 'react';
import { View } from 'react-native';
import { CloudRain } from 'lucide-react-native';
import { Text } from '~/components/ui/text';
import { getPrecipitationColor } from '~/lib/constants';

interface PrecipitationIconProps {
  percentage: number;
  size?: number;
  showPercentage?: boolean;
}

export function PrecipitationIcon({
  percentage,
  size = 20,
  showPercentage = false,
}: PrecipitationIconProps) {
  const color = getPrecipitationColor(percentage);

  return (
    <View className="flex-row items-center gap-1">
      <CloudRain size={size} color={color} />
      {showPercentage && (
        <Text size="sm" variant="muted">
          {percentage}%
        </Text>
      )}
    </View>
  );
}
