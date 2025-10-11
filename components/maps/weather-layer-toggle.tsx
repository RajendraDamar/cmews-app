// Weather Layer Toggle Component
import { View, Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';
import * as Haptics from 'expo-haptics';

interface WeatherLayerToggleProps {
  showLayer: boolean;
  onToggle: () => void;
}

export function WeatherLayerToggle({ showLayer, onToggle }: WeatherLayerToggleProps) {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === 'dark' ? '#e5e7eb' : '#1f2937';

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };

  return (
    <View className="absolute right-4 top-24 z-40">
      <Pressable
        onPress={handleToggle}
        className="flex-row items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 shadow-lg active:opacity-70"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 5,
        }}>
        {showLayer ? <EyeOff size={18} color={iconColor} /> : <Eye size={18} color={iconColor} />}
        <Text className="text-sm font-medium">
          {showLayer ? 'Sembunyikan' : 'Tampilkan'} Lapisan
        </Text>
      </Pressable>
    </View>
  );
}
