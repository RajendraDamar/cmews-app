import React, { useEffect, useRef } from 'react';
import { View, Pressable, Platform, Animated, Easing } from 'react-native';
import { MapPin, RefreshCw } from 'lucide-react-native';
import { Text } from '~/components/ui/text';
import { useTheme } from '~/lib/theme-provider';
import { getThemeColor } from '~/lib/constants';
import { cn } from '~/lib/utils';
import * as Haptics from 'expo-haptics';

interface LocationInfo {
  provinsi?: string;
  kota?: string;
  kecamatan?: string;
}

interface LocationSelectorProps {
  /** Location details (nested format) */
  location?: LocationInfo;
  /** Flat location fields (optional fallbacks) */
  provinsi?: string;
  kota?: string;
  kecamatan?: string;
  /** Last updated formatted text */
  lastUpdated?: string;
  /** Whether a data refresh is in flight */
  refreshing?: boolean;
  /** Refresh callback */
  onRefresh?: () => void;
  /** Press handler for location picker dialog */
  onPress?: () => void;
  onLocationPress?: () => void;
  className?: string;
}

export function LocationSelector({
  location,
  provinsi: flatProvinsi,
  kota: flatKota,
  kecamatan: flatKecamatan,
  lastUpdated,
  refreshing = false,
  onRefresh,
  onPress,
  onLocationPress,
  className,
}: LocationSelectorProps) {
  const { colorScheme } = useTheme();
  const themeColors = getThemeColor(colorScheme === 'dark');

  const kecamatan = location?.kecamatan || flatKecamatan || 'Jakarta Pusat';
  const kota = location?.kota || flatKota || 'Gambir';
  const provinsi = location?.provinsi || flatProvinsi || 'DKI Jakarta';

  const handleLocationPress = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Haptics safe fallback
      }
    }
    onPress?.();
    onLocationPress?.();
  };

  const handleRefreshPress = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {
        // Haptics safe fallback
      }
    }
    onRefresh?.();
  };

  // Native spin animation
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (Platform.OS !== 'web' && refreshing) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else if (Platform.OS !== 'web') {
      spinAnim.stopAnimation();
      Animated.spring(spinAnim, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }).start();
    }
  }, [refreshing, spinAnim]);

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View
      className={cn(
        'flex-row items-center justify-between px-4 pb-3 pt-4',
        className
      )}>
      {/* Location Pressable */}
      <Pressable
        onPress={handleLocationPress}
        className="flex-1 flex-row items-center gap-2.5 rounded-lg py-1 pr-2 active:opacity-70 web:hover:opacity-80 web:transition-opacity"
        accessibilityRole="button"
        accessibilityLabel={`Pilih lokasi. Lokasi saat ini: ${kecamatan}, ${kota}, ${provinsi}`}>
        <View className="items-center justify-center">
          <MapPin size={20} color={themeColors.primary} />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold" style={{ color: themeColors.foreground }}>
            {kecamatan}
          </Text>
          <Text variant="muted" size="sm" style={{ color: themeColors.muted }}>
            {kota}, {provinsi}
          </Text>
        </View>
      </Pressable>

      {/* Refresh Button & Timestamp */}
      <View className="items-end gap-0.5">
        {onRefresh && (
          <Pressable
            onPress={handleRefreshPress}
            disabled={refreshing}
            className="rounded-full p-2 active:bg-muted/80 web:hover:bg-muted web:transition-colors"
            accessibilityRole="button"
            accessibilityLabel="Perbarui cuaca">
            {Platform.OS === 'web' ? (
              <View className={cn(refreshing && 'animate-spin-smooth')}>
                <RefreshCw size={20} color={themeColors.primary} />
              </View>
            ) : (
              <Animated.View style={{ transform: [{ rotate: spinInterpolate }] }}>
                <RefreshCw size={20} color={themeColors.primary} />
              </Animated.View>
            )}
          </Pressable>
        )}
        {lastUpdated && (
          <Text variant="muted" size="sm">
            {lastUpdated}
          </Text>
        )}
      </View>
    </View>
  );
}
