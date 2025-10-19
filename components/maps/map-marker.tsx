import { View } from 'react-native';
import { useTheme } from '~/lib/theme-provider';
import { getThemeColor } from '~/lib/constants';
import {
  Utensils,
  Fuel,
  ParkingCircle,
  Bed,
  Banknote,
  Cross,
  Trees,
  Landmark,
  MapPin,
} from 'lucide-react-native';

interface MapMarkerProps {
  category: string;
  selected?: boolean;
}

export function MapMarker({ category, selected = false }: MapMarkerProps) {
  const { colorScheme } = useTheme();
  const theme = getThemeColor(colorScheme === 'dark');
  const iconMap: Record<string, any> = {
    restaurant: Utensils,
    gas: Fuel,
    parking: ParkingCircle,
    hotel: Bed,
    atm: Banknote,
    hospital: Cross,
    park: Trees,
    landmark: Landmark,
  };

  const colorMap: Record<string, string> = {
    restaurant: '#ef4444',
    gas: '#f59e0b',
    parking: '#3b82f6',
    hotel: '#8b5cf6',
    atm: '#10b981',
    hospital: '#dc2626',
    park: '#059669',
    landmark: '#0891b2',
  };

  const Icon = iconMap[category] || MapPin;
  const color = colorMap[category] || '#6b7280';

  return (
    <View
      style={{
        width: selected ? 44 : 36,
        height: selected ? 44 : 36,
        backgroundColor: color,
        borderRadius: selected ? 22 : 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: selected ? 4 : 3,
  borderColor: theme.primaryForeground,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      }}>
  <Icon size={selected ? 20 : 16} color={theme.primaryForeground} />
    </View>
  );
}
