import React from 'react';
import { View, Pressable } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Badge } from '~/components/ui/badge';
import { AlertTriangle, X } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';
import type { WeatherAlert } from '~/lib/types/weather';
import { parseBMKGDateTime, formatTime24 } from '~/lib/utils/indonesian-locale';
import { COLORS, getThemeColor } from '~/lib/constants';

interface WeatherAlertProps {
  alert: WeatherAlert;
  onDismiss: () => void;
}

export function WeatherAlertCard({ alert, onDismiss }: WeatherAlertProps) {
  const { colorScheme } = useTheme();
  const themeColors = getThemeColor(colorScheme === 'dark');

  // Use severity colors from constants
  const alertColors = {
    warning: { 
      bg: 'bg-destructive/10', 
      border: 'border-destructive/50', 
      text: 'text-destructive',
      iconColor: COLORS.severity.high
    },
    watch: { 
      bg: 'bg-accent/10', 
      border: 'border-accent/50', 
      text: 'text-foreground',
      iconColor: COLORS.severity.medium
    },
    advisory: { 
      bg: 'bg-primary/10', 
      border: 'border-primary/50', 
      text: 'text-primary',
      iconColor: COLORS.severity.low
    },
  };

  const colors = alertColors[alert.type];
  const validFrom = parseBMKGDateTime(alert.validFrom);
  const validTo = parseBMKGDateTime(alert.validTo);

  return (
    <Card className={`mx-4 mb-4 border-2 ${colors.border}`}>
      <CardContent className={`p-4 ${colors.bg}`}>
        <View className="flex-row items-start justify-between">
          <View className="flex-1 flex-row items-start gap-3">
            <AlertTriangle
              size={24}
              color={colors.iconColor}
              className={colors.text}
            />
            <View className="flex-1">
              <View className="mb-2 flex-row items-center gap-2">
                <Text className={`font-bold ${colors.text}`}>{alert.title}</Text>
                <Badge
                  variant="outline"
                  className="text-xs"
                  label={
                    alert.type === 'warning'
                      ? 'Peringatan'
                      : alert.type === 'watch'
                        ? 'Pengawasan'
                        : 'Pemberitahuan'
                  }
                />
              </View>
              <Text className="mb-2 text-foreground">{alert.description}</Text>
              <Text variant="muted" size="sm">
                Berlaku: {formatTime24(validFrom)} - {formatTime24(validTo)}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={onDismiss}
            className="rounded-full p-1"
            accessibilityLabel="Tutup peringatan">
            <X size={20} color={themeColors.muted} />
          </Pressable>
        </View>
      </CardContent>
    </Card>
  );
}
