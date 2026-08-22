import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
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
  const isDark = colorScheme === 'dark';

  const alertConfigs = {
    warning: {
      border: isDark ? 'rgba(249, 115, 22, 0.5)' : 'rgba(249, 115, 22, 0.4)',
      bg: isDark ? 'rgba(249, 115, 22, 0.1)' : 'rgba(249, 115, 22, 0.06)',
      cardBg: isDark ? '#0b1329' : '#ffffff',
      title: '#f97316',
      icon: '#f97316',
      badgeBg: isDark ? 'rgba(249, 115, 22, 0.2)' : 'rgba(249, 115, 22, 0.12)',
      badgeBorder: isDark ? 'rgba(249, 115, 22, 0.45)' : 'rgba(249, 115, 22, 0.35)',
      badgeText: isDark ? '#fb923c' : '#c2410c',
      badgeLabel: 'Peringatan',
    },
    watch: {
      border: isDark ? 'rgba(234, 179, 8, 0.5)' : 'rgba(234, 179, 8, 0.4)',
      bg: isDark ? 'rgba(234, 179, 8, 0.1)' : 'rgba(234, 179, 8, 0.06)',
      cardBg: isDark ? '#0b1329' : '#ffffff',
      title: '#eab308',
      icon: '#eab308',
      badgeBg: isDark ? 'rgba(234, 179, 8, 0.2)' : 'rgba(234, 179, 8, 0.12)',
      badgeBorder: isDark ? 'rgba(234, 179, 8, 0.45)' : 'rgba(234, 179, 8, 0.35)',
      badgeText: isDark ? '#facc15' : '#a16207',
      badgeLabel: 'Pengawasan',
    },
    advisory: {
      border: isDark ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.4)',
      bg: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.06)',
      cardBg: isDark ? '#0b1329' : '#ffffff',
      title: '#3b82f6',
      icon: '#3b82f6',
      badgeBg: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.12)',
      badgeBorder: isDark ? 'rgba(59, 130, 246, 0.45)' : 'rgba(59, 130, 246, 0.35)',
      badgeText: isDark ? '#60a5fa' : '#1d4ed8',
      badgeLabel: 'Pemberitahuan',
    },
  };

  const config = alertConfigs[alert.type] || alertConfigs.warning;
  const validFrom = parseBMKGDateTime(alert.validFrom);
  const validTo = parseBMKGDateTime(alert.validTo);

  return (
    <View
      className="mb-4 overflow-hidden rounded-xl"
      style={{
        borderWidth: 1.5,
        borderColor: config.border,
        backgroundColor: config.cardBg,
      }}>
      <View
        className="p-4"
        style={{
          backgroundColor: config.bg,
        }}>
        <View className="flex-row items-start justify-between">
          <View className="flex-1 flex-row items-start gap-3">
            <AlertTriangle
              size={22}
              color={config.icon}
            />
            <View className="flex-1">
              <View className="mb-1.5 flex-row flex-wrap items-center gap-2">
                <Text
                  className="text-base font-bold"
                  style={{ color: config.title }}>
                  {alert.title}
                </Text>
                <View
                  className="rounded-full px-2 py-0.5"
                  style={{
                    backgroundColor: config.badgeBg,
                    borderWidth: 1,
                    borderColor: config.badgeBorder,
                  }}>
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: config.badgeText }}>
                    {config.badgeLabel}
                  </Text>
                </View>
              </View>
              <Text
                className="mb-2 text-sm leading-relaxed"
                style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
                {alert.description}
              </Text>
              <Text
                size="sm"
                style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                Berlaku: {formatTime24(validFrom)} - {formatTime24(validTo)}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={onDismiss}
            hitSlop={10}
            className="rounded-full p-1 active:opacity-60"
            accessibilityLabel="Tutup peringatan">
            <X size={18} color={isDark ? '#94a3b8' : '#64748b'} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
