// Desktop Map Panel Component - Minimal sidebar for map screen
import React from 'react';
import { View, Pressable } from 'react-native';
import { Plus, Eye, EyeOff } from 'lucide-react-native';
import { Text } from '~/components/ui/text';
import { Input } from '~/components/ui/input';
// Button intentionally not used here; using Pressable + Text for consistent icon
import { useTheme } from '~/lib/theme-provider';
import { getThemeColor } from '~/lib/constants';

interface DesktopMapPanelProps {
  showWeatherLayer: boolean;
  onToggleLayer: () => void;
  onAddReport: () => void;
}

export function DesktopMapPanel({
  showWeatherLayer,
  onToggleLayer,
  onAddReport,
}: DesktopMapPanelProps) {
  const { colorScheme } = useTheme();
  const themeColors = getThemeColor(colorScheme === 'dark');

  // Use JS theme colors to ensure FAB matches theme state

  return (
    <View
      className="absolute left-6 top-6 z-50 flex-col gap-3"
      style={{
        width: 280,
      }}>
      {/* Search Input */}
      <View
        className="rounded-lg border border-border bg-card shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        }}>
        <Input
          placeholder="Cari lokasi..."
          className="h-11 border-0"
          placeholderTextColor={colorScheme === 'dark' ? '#888' : '#999'}
        />
      </View>

      {/* Show/Hide Layer Button */}
      <View
        className="rounded-lg border border-border bg-card shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        }}>
        <Pressable
          onPress={onToggleLayer}
          className="h-11 flex-row items-center justify-start gap-3 px-3"
          accessibilityRole="button">
          {showWeatherLayer ? (
            <EyeOff size={18} color={colorScheme === 'dark' ? '#e5e7eb' : themeColors.icon.foreground} />
          ) : (
            <Eye size={18} color={colorScheme === 'dark' ? '#e5e7eb' : themeColors.icon.foreground} />
          )}
          <Text className="text-sm font-medium">
            {showWeatherLayer ? 'Sembunyikan Lapisan' : 'Tampilkan Lapisan'}
          </Text>
        </Pressable>
      </View>

      {/* Floating Action Button - Add Report */}
      <Pressable
        onPress={onAddReport}
        className="mt-2 h-12 w-12 items-center justify-center self-start rounded-full shadow-xl active:scale-95 border bg-card border-border"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 8,
        }}>
        <Plus size={22} color={colorScheme === 'dark' ? 'hsl(210 40% 98%)' : themeColors.icon.foreground} />
      </Pressable>
    </View>
  );
}
