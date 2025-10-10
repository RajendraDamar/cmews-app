import React from 'react';
import { View, Pressable } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Badge } from '~/components/ui/badge';
import { AlertTriangle, X } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';
import type { WeatherAlert } from '~/lib/types/weather';
import { parseBMKGDateTime, formatTime24 } from '~/lib/utils/indonesian-locale';

interface WeatherAlertProps {
  alert: WeatherAlert;
  onDismiss: () => void;
}

export function WeatherAlertCard({ alert, onDismiss }: WeatherAlertProps) {
  const { colorScheme } = useTheme();

  const alertColors = {
    warning: { bg: 'bg-orange-500/10', border: 'border-orange-500/50', text: 'text-orange-500' },
    watch: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/50', text: 'text-yellow-500' },
    advisory: { bg: 'bg-blue-500/10', border: 'border-blue-500/50', text: 'text-blue-500' },
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
              color={colorScheme === 'dark' ? '#f97316' : '#ea580c'}
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
              <Text className="mb-2">{alert.description}</Text>
              <Text variant="muted" size="sm">
                Berlaku: {formatTime24(validFrom)} - {formatTime24(validTo)}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={onDismiss}
            className="rounded-full p-1"
            accessibilityLabel="Tutup peringatan">
            <X size={20} color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} />
          </Pressable>
        </View>
      </CardContent>
    </Card>
  );
}
