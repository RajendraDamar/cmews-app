import { View } from 'react-native';
import { Sun, Cloud, CloudRain, CloudDrizzle, CloudSnow, CloudRainWind } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';

interface WeatherIconProps {
  weather: string;
  size?: number;
}

export function WeatherIcon({ weather, size = 32 }: WeatherIconProps) {
  const { colorScheme } = useTheme();
  
  // Determine icon and background color based on weather condition
  let IconComponent = Cloud;
  let bgColor = 'bg-muted';
  const iconColor = colorScheme === 'dark' ? '#fff' : '#fff';

  const weatherLower = weather.toLowerCase();

  if (weatherLower.includes('cerah') && !weatherLower.includes('berawan')) {
    IconComponent = Sun;
    bgColor = 'bg-[hsl(45_93%_47%)]'; // COLORS.weather.sunny
  } else if (weatherLower.includes('cerah berawan')) {
    IconComponent = Cloud;
    bgColor = 'bg-[hsl(215_20%_65%)]'; // COLORS.weather.cloudy
  } else if (weatherLower.includes('berawan')) {
    IconComponent = Cloud;
    bgColor = 'bg-muted';
  } else if (weatherLower.includes('hujan lebat')) {
    IconComponent = CloudRainWind;
    bgColor = 'bg-[hsl(271_76%_53%)]'; // COLORS.weather.stormy
  } else if (weatherLower.includes('hujan sedang')) {
    IconComponent = CloudRain;
    bgColor = 'bg-[hsl(217_91%_60%)]'; // COLORS.weather.rainy
  } else if (weatherLower.includes('hujan ringan') || weatherLower.includes('gerimis')) {
    IconComponent = CloudDrizzle;
    bgColor = 'bg-primary';
  } else if (weatherLower.includes('salju')) {
    IconComponent = CloudSnow;
    bgColor = 'bg-[hsl(217_91%_60%)]'; // COLORS.weather.rainy
  }

  return (
    <View className={`${bgColor} rounded-full p-2`}>
      <IconComponent size={size} color={iconColor} />
    </View>
  );
}
