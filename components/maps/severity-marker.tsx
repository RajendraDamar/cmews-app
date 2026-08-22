// Severity Marker Component for Weather Reports
import { View, Pressable } from 'react-native';
import { CloudRain, Cloud, Sun, CloudDrizzle, Wind } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';
import { getThemeColor } from '~/lib/constants';
import { WeatherReport } from '~/lib/types/weather-report';

interface SeverityMarkerProps {
  report: WeatherReport;
  onPress?: () => void;
  selected?: boolean;
}

const getSeverityColor = (severity?: string) => {
  switch (severity?.toLowerCase()) {
    case 'low':
    case 'rendah':
      return '#10B981';
    case 'medium':
    case 'sedang':
      return '#F59E0B';
    case 'high':
    case 'tinggi':
      return '#EF4444';
    default:
      return '#10B981';
  }
};

const getWeatherIcon = (weather: string) => {
  const lowerWeather = weather.toLowerCase();
  if (lowerWeather.includes('hujan lebat')) return CloudRain;
  if (lowerWeather.includes('hujan')) return CloudDrizzle;
  if (lowerWeather.includes('cerah')) return Sun;
  if (lowerWeather.includes('kabut')) return Wind;
  return Cloud;
};

export function SeverityMarker({ report, onPress, selected = false }: SeverityMarkerProps) {
  const color = getSeverityColor(report.severity);
  const Icon = getWeatherIcon(report.weather);
  const { colorScheme } = useTheme();
  const theme = getThemeColor(colorScheme === 'dark');

  const markerView = (
    <View
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: color,
        borderWidth: selected ? 4 : 3,
        borderColor: selected ? '#FFFFFF' : theme.primaryForeground,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
      }}>
      <Icon size={22} color="#FFFFFF" />
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{markerView}</Pressable>;
  }

  return markerView;
}
