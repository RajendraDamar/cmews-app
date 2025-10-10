// Weather Layer Toggle Component
import { View } from 'react-native';
import { Button } from '~/components/ui/button';

interface WeatherLayerToggleProps {
  showLayer: boolean;
  onToggle: () => void;
}

export function WeatherLayerToggle({ showLayer, onToggle }: WeatherLayerToggleProps) {
  return (
    <View className="absolute right-4 top-24">
      <Button
        variant="outline"
        onPress={onToggle}
        label={showLayer ? '🌧️ Sembunyikan Lapisan' : '🌤️ Tampilkan Lapisan'}
        size="sm"
        className="bg-card"
      />
    </View>
  );
}
