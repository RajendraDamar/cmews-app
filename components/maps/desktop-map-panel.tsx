// Desktop Map Panel Component - Minimal sidebar for map screen
import { View, Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
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

  return (
    <View
      className="absolute left-4 top-4 z-50 w-64 flex-col gap-3"
      style={{
        maxWidth: 280,
      }}>
      {/* Search Input */}
      <View
        className="rounded-lg border border-border bg-card shadow-lg"
        style={{
          shadowColor: themeColors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        }}>
        <Input
          placeholder="Cari lokasi..."
          className="h-12 border-0"
          placeholderTextColor={themeColors.mutedForeground}
        />
      </View>

      {/* Show/Hide Layer Button */}
      <View
        className="rounded-lg border border-border bg-card shadow-lg"
        style={{
          shadowColor: themeColors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        }}>
        <Button
          label={showWeatherLayer ? '🌧️ Sembunyikan Lapisan' : '☀️ Tampilkan Lapisan'}
          onPress={onToggleLayer}
          variant="ghost"
          className="h-12 justify-start"
        />
      </View>

      {/* Floating Action Button - Add Report */}
      <Pressable
        onPress={onAddReport}
        className="mt-auto h-14 w-14 items-center justify-center self-start rounded-full bg-primary shadow-xl active:scale-95"
        style={{
          shadowColor: themeColors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 8,
        }}>
        <Plus size={24} className="text-primary-foreground" color={themeColors.card} />
      </Pressable>
    </View>
  );
}
