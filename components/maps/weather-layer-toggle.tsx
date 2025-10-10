// Weather Layer Toggle Component
import { View } from 'react-native';
import { CloudRain } from 'lucide-react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

interface WeatherLayerToggleProps {
  showLayer: boolean;
  onToggle: () => void;
}

export function WeatherLayerToggle({ showLayer, onToggle }: WeatherLayerToggleProps) {
  return (
    <View className="absolute right-4 top-24">
      <Button variant="outline" onPress={onToggle} className="flex-row items-center gap-2 bg-card">
        <CloudRain size={16} />
        <Text className="text-sm">{showLayer ? 'Sembunyikan' : 'Tampilkan'} Lapisan Cuaca</Text>
      </Button>
    </View>
  );
}
