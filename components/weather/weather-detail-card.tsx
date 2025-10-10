import React from 'react';
import { View } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { useTheme } from '~/lib/theme-provider';
import type { LucideIcon } from 'lucide-react-native';

interface WeatherDetailCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  iconColor?: string;
}

export function WeatherDetailCard({ icon: Icon, label, value, iconColor }: WeatherDetailCardProps) {
  const { colorScheme } = useTheme();
  const defaultColor = colorScheme === 'dark' ? '#60a5fa' : '#3b82f6';

  return (
    <Card className="min-w-[45%] flex-1">
      <CardContent className="p-4">
        <View className="flex-row items-center gap-2">
          <Icon size={20} color={iconColor || defaultColor} />
          <Text variant="muted">{label}</Text>
        </View>
        <Text className="mt-2 text-2xl font-semibold">{value}</Text>
      </CardContent>
    </Card>
  );
}
