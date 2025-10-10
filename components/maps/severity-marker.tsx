// Severity Marker Component for Weather Reports
import { View, Pressable } from 'react-native';
import { CloudRain, Cloud, Sun, CloudDrizzle, Wind } from 'lucide-react-native';
import { WeatherReport } from '~/lib/types/weather-report';

interface SeverityMarkerProps {
  report: WeatherReport;
  onPress: () => void;
  selected?: boolean;
}

const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
  switch (severity) {
    case 'low':
      return '#10B981';
    case 'medium':
      return '#F59E0B';
    case 'high':
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

  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          width: selected ? 44 : 40,
          height: selected ? 44 : 40,
          borderRadius: selected ? 22 : 20,
          backgroundColor: color,
          borderWidth: 3,
          borderColor: color,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}>
        <Icon size={selected ? 22 : 20} color="#fff" />
      </View>
    </Pressable>
  );
}
