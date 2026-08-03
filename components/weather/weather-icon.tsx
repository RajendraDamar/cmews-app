import React from 'react';
import { View } from 'react-native';
import { useTheme } from '~/lib/theme-provider';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudLightning,
  CloudFog,
} from 'lucide-react-native';
import { cn } from '~/lib/utils';

interface WeatherIconProps {
  condition: string;
  size?: number;
}

export function WeatherIcon({ condition, size = 48 }: WeatherIconProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const weatherLower = (condition || '').toLowerCase();

  let IconComponent = Cloud;
  let iconColor = isDark ? '#f8fafc' : '#334155';
  let backgroundColor = isDark ? '#1e293b' : '#e2e8f0';

  if (weatherLower.includes('cerah') && !weatherLower.includes('berawan')) {
    IconComponent = Sun;
    iconColor = isDark ? '#fbbf24' : '#d97706';
    backgroundColor = isDark ? '#451a03' : '#fef3c7';
  } else if (weatherLower.includes('cerah berawan')) {
    IconComponent = CloudSun;
    iconColor = isDark ? '#fdba74' : '#c2410c';
    backgroundColor = isDark ? '#431407' : '#ffedd5';
  } else if (weatherLower.includes('berawan')) {
    IconComponent = Cloud;
    iconColor = isDark ? '#e2e8f0' : '#475569';
    backgroundColor = isDark ? '#334155' : '#e2e8f0';
  } else if (weatherLower.includes('hujan lebat') || weatherLower.includes('petir')) {
    IconComponent = weatherLower.includes('petir') ? CloudLightning : CloudRainWind;
    iconColor = isDark ? '#c084fc' : '#6d28d9';
    backgroundColor = isDark ? '#3b0764' : '#f3e8ff';
  } else if (weatherLower.includes('hujan sedang') || weatherLower.includes('hujan')) {
    IconComponent = CloudRain;
    iconColor = isDark ? '#60a5fa' : '#1d4ed8';
    backgroundColor = isDark ? '#172554' : '#dbeafe';
  } else if (weatherLower.includes('hujan ringan') || weatherLower.includes('gerimis')) {
    IconComponent = CloudDrizzle;
    iconColor = isDark ? '#38bdf8' : '#0284c7';
    backgroundColor = isDark ? '#082f49' : '#e0f2fe';
  } else if (weatherLower.includes('kabut') || weatherLower.includes('asap')) {
    IconComponent = CloudFog;
    iconColor = isDark ? '#cbd5e1' : '#475569';
    backgroundColor = isDark ? '#1e293b' : '#f1f5f9';
  }

  const iconSize = size * 0.55;

  return (
    <View
      className={cn('items-center justify-center rounded-full')}
      style={{
        width: size,
        height: size,
        backgroundColor,
      }}>
      <IconComponent size={iconSize} color={iconColor} />
    </View>
  );
}
