import { View } from 'react-native';
import { Sun, Cloud, CloudRain, CloudDrizzle, CloudSnow, CloudRainWind } from 'lucide-react-native';

interface WeatherIconProps {
  weather: string;
  size?: number;
}

export function WeatherIcon({ weather, size = 32 }: WeatherIconProps) {
  // Determine icon and background color based on weather condition
  let IconComponent = Cloud;
  let bgColor = 'bg-gray-500';
  let iconColor = '#fff';

  const weatherLower = weather.toLowerCase();

  if (weatherLower.includes('cerah') && !weatherLower.includes('berawan')) {
    IconComponent = Sun;
    bgColor = 'bg-yellow-500';
  } else if (weatherLower.includes('cerah berawan')) {
    IconComponent = Cloud;
    bgColor = 'bg-yellow-400';
  } else if (weatherLower.includes('berawan')) {
    IconComponent = Cloud;
    bgColor = 'bg-gray-400';
  } else if (weatherLower.includes('hujan lebat')) {
    IconComponent = CloudRainWind;
    bgColor = 'bg-blue-700';
  } else if (weatherLower.includes('hujan sedang')) {
    IconComponent = CloudRain;
    bgColor = 'bg-blue-600';
  } else if (weatherLower.includes('hujan ringan') || weatherLower.includes('gerimis')) {
    IconComponent = CloudDrizzle;
    bgColor = 'bg-blue-500';
  } else if (weatherLower.includes('salju')) {
    IconComponent = CloudSnow;
    bgColor = 'bg-blue-300';
  }

  return (
    <View className={`${bgColor} rounded-full p-2`}>
      <IconComponent size={size} color={iconColor} />
    </View>
  );
}
