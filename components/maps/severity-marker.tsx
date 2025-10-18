// Severity Marker Component for Weather Reports
import { View, Pressable } from 'react-native';
import { CloudRain, Cloud, Sun, CloudDrizzle, Wind } from 'lucide-react-native';
import { WeatherReport } from '~/lib/types/weather-report';
import { COLORS } from '~/lib/constants';

interface SeverityMarkerProps {
  report: WeatherReport;
  onPress: () => void;
  selected?: boolean;
}

const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
  switch (severity) {
    case 'low':
      return COLORS.severity.low;
    case 'medium':
      return COLORS.severity.medium;
    case 'high':
      return COLORS.severity.high;
    default:
      return COLORS.severity.low;
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

  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          width: selected ? 48 : 42,
          height: selected ? 48 : 42,
          borderRadius: selected ? 24 : 21,
          backgroundColor: color,
          borderWidth: selected ? 4 : 3,
          borderColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 6,
        }}>
        <Icon size={selected ? 24 : 22} color="#fff" />
      </View>
    </Pressable>
  );
}
