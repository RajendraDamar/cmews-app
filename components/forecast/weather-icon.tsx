import { View } from 'react-native';
import { Sun, Cloud, CloudRain, CloudDrizzle, CloudSnow, CloudRainWind } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';
import { getIconForDescription } from '~/lib/utils/weather-icons';

interface WeatherIconProps {
  weather: string;
  size?: number;
}

export function WeatherIcon({ weather, size = 32 }: WeatherIconProps) {
  const { colorScheme } = useTheme();
  
  // Determine icon and background color based on weather condition
  let IconComponent = Cloud;
  let bgColor = 'bg-muted';
  const isDark = colorScheme === 'dark';
  const suggested = getIconForDescription(weather);
  const iconColor = suggested?.color?.[isDark ? 'dark' : 'light'] || (isDark ? '#fff' : '#111');
  const darkBg = isDark ? { backgroundColor: suggested?.bgColor?.dark ?? '#0b1220' } : {};

  const weatherLower = weather.toLowerCase();

  if (weatherLower.includes('cerah') && !weatherLower.includes('berawan')) {
    IconComponent = Sun;
    bgColor = 'bg-yellow-500';
  } else if (weatherLower.includes('cerah berawan')) {
    IconComponent = Cloud;
    bgColor = 'bg-yellow-400';
  } else if (weatherLower.includes('berawan')) {
    IconComponent = Cloud;
    bgColor = 'bg-muted';
  } else if (weatherLower.includes('hujan lebat')) {
    IconComponent = CloudRainWind;
    bgColor = 'bg-blue-700';
  } else if (weatherLower.includes('hujan sedang')) {
    IconComponent = CloudRain;
    bgColor = 'bg-blue-600';
  } else if (weatherLower.includes('hujan ringan') || weatherLower.includes('gerimis')) {
    IconComponent = CloudDrizzle;
    bgColor = 'bg-primary';
  } else if (weatherLower.includes('salju')) {
    IconComponent = CloudSnow;
    bgColor = 'bg-blue-300';
  }

  return (
    <View className={`${bgColor} rounded-full p-2`} style={darkBg}>
      <IconComponent size={size} color={iconColor} />
    </View>
  );
}
