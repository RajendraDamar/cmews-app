import React from 'react';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { CloudOff, Map, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';
import { getThemeColors } from '~/lib/theme';

interface EmptyStateProps {
  icon?: 'weather' | 'map' | 'error';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = 'weather',
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { colorScheme } = useTheme();
  const colors = getThemeColors(colorScheme);
  const iconColor = colors.mutedForeground;

  const IconComponent = icon === 'weather' ? CloudOff : icon === 'map' ? Map : AlertTriangle;

  return (
    <Card className="mx-4">
      <CardContent className="items-center justify-center p-8">
        <IconComponent size={64} color={iconColor} />
        <Text className="mt-4 text-center text-xl font-semibold">{title}</Text>
        <Text variant="muted" className="mt-2 text-center">
          {message}
        </Text>
        {actionLabel && onAction && (
          <Button label={actionLabel} onPress={onAction} className="mt-6" />
        )}
      </CardContent>
    </Card>
  );
}
