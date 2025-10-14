import React from 'react';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { AlertTriangle } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';
import { getThemeColors } from '~/lib/theme';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Terjadi Kesalahan', message, onRetry }: ErrorStateProps) {
  const { colorScheme } = useTheme();
  const colors = getThemeColors(colorScheme);

  return (
    <Card className="mx-4 border-destructive">
      <CardContent className="items-center justify-center p-8">
        <AlertTriangle size={64} color={colors.destructive} />
        <Text className="mt-4 text-center text-xl font-semibold text-destructive">{title}</Text>
        <Text variant="muted" className="mt-2 text-center">
          {message}
        </Text>
        {onRetry && <Button label="Coba Lagi" onPress={onRetry} className="mt-6" />}
      </CardContent>
    </Card>
  );
}
