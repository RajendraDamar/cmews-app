import { View } from 'react-native';
import { Sun, Cloud, CloudSun, CloudRain, CloudDrizzle, CloudSnow, CloudRainWind, CloudLightning, CloudFog } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';

interface WeatherIconProps {
  weather: string;
  size?: number;
}

export function WeatherIcon({ weather, size = 32 }: WeatherIconProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const weatherLower = (weather || '').toLowerCase();

  let IconComponent = Cloud;
  // Default slate colors with strong contrast against card backgrounds
  let iconColor = isDark ? '#f8fafc' : '#334155';
  let backgroundColor = isDark ? '#1e293b' : '#e2e8f0';

  if (weatherLower.includes('cerah') && !weatherLower.includes('berawan')) {
    IconComponent = Sun;
    iconColor = isDark ? '#fbbf24' : '#d97706'; // Amber / Deep Amber Sun
    backgroundColor = isDark ? '#451a03' : '#fef3c7'; // Dark Amber Brown / Light Cream
  } else if (weatherLower.includes('cerah berawan')) {
    IconComponent = CloudSun;
    iconColor = isDark ? '#fdba74' : '#c2410c'; // Bright Orange / Deep Burnt Orange
    backgroundColor = isDark ? '#431407' : '#ffedd5'; // Dark Orange-Brown / Light Warm Orange
  } else if (weatherLower.includes('berawan')) {
    IconComponent = Cloud;
    iconColor = isDark ? '#e2e8f0' : '#475569'; // Crisp Slate
    backgroundColor = isDark ? '#334155' : '#e2e8f0';
  } else if (weatherLower.includes('hujan lebat') || weatherLower.includes('petir')) {
    IconComponent = weatherLower.includes('petir') ? CloudLightning : CloudRainWind;
    iconColor = isDark ? '#c084fc' : '#6d28d9'; // Bright Violet / Deep Purple
    backgroundColor = isDark ? '#3b0764' : '#f3e8ff'; // Dark Purple / Soft Purple
  } else if (weatherLower.includes('hujan sedang') || weatherLower.includes('hujan')) {
    IconComponent = CloudRain;
    iconColor = isDark ? '#60a5fa' : '#1d4ed8'; // Bright Blue / Deep Blue
    backgroundColor = isDark ? '#172554' : '#dbeafe'; // Dark Blue / Soft Blue
  } else if (weatherLower.includes('hujan ringan') || weatherLower.includes('gerimis')) {
    IconComponent = CloudDrizzle;
    iconColor = isDark ? '#38bdf8' : '#0284c7'; // Bright Sky / Deep Sky
    backgroundColor = isDark ? '#082f49' : '#e0f2fe'; // Dark Sky / Soft Sky
  } else if (weatherLower.includes('salju')) {
    IconComponent = CloudSnow;
    iconColor = isDark ? '#7dd3fc' : '#0369a1';
    backgroundColor = isDark ? '#0c4a6e' : '#e0f2fe';
  } else if (weatherLower.includes('kabut') || weatherLower.includes('asap')) {
    IconComponent = CloudFog;
    iconColor = isDark ? '#cbd5e1' : '#475569';
    backgroundColor = isDark ? '#1e293b' : '#f1f5f9';
  }

  const paddingSize = Math.max(6, Math.round(size * 0.25));

  return (
    <View
      className="items-center justify-center rounded-full"
      style={{
        padding: paddingSize,
        backgroundColor,
      }}
    >
      <IconComponent size={size} color={iconColor} />
    </View>
  );
}
