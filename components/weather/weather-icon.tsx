import React from 'react';
import { View } from 'react-native';
import { useTheme } from '~/lib/theme-provider';
import { getWeatherColor, getIconForDescription } from '~/lib/utils/weather-icons';
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

interface WeatherIconConfig {
  icon: React.ComponentType<{ size: number; color: string }>;
  iconColor: string;
  bgColor: string;
}

const WEATHER_ICON_MAP: Record<string, WeatherIconConfig> = {
  Cerah: {
    icon: Sun,
    iconColor: '#eab308', // yellow-500
    bgColor: '#fef3c7', // yellow-100
  },
  'Cerah Berawan': {
    icon: CloudSun,
    iconColor: '#fb923c', // orange-400
    bgColor: '#ffedd5', // orange-100
  },
  Berawan: {
    icon: Cloud,
    iconColor: '#9ca3af', // gray-400
    bgColor: '#f3f4f6', // gray-100
  },
  'Hujan Ringan': {
    icon: CloudDrizzle,
    iconColor: '#60a5fa', // blue-400
    bgColor: '#dbeafe', // blue-100
  },
  'Hujan Sedang': {
    icon: CloudRain,
    iconColor: '#3b82f6', // blue-500
    bgColor: '#dbeafe', // blue-100
  },
  'Hujan Lebat': {
    icon: CloudRainWind,
    iconColor: '#1d4ed8', // blue-700
    bgColor: '#bfdbfe', // blue-200
  },
  'Hujan Petir': {
    icon: CloudLightning,
    iconColor: '#a855f7', // purple-500
    bgColor: '#f3e8ff', // purple-100
  },
  Petir: {
    icon: CloudLightning,
    iconColor: '#a855f7', // purple-500
    bgColor: '#f3e8ff', // purple-100
  },
  Kabut: {
    icon: CloudFog,
    iconColor: '#d1d5db', // gray-300
    bgColor: '#f3f4f6', // gray-100
  },
};

export function WeatherIcon({ condition, size = 48 }: WeatherIconProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const fallback = WEATHER_ICON_MAP[condition] || WEATHER_ICON_MAP.Cerah;
  const suggested = getIconForDescription(condition);

  const IconComponent = suggested.icon || fallback.icon;
  const iconSize = size * 0.6; // Icon is 60% of container size

  // Pick an icon color that adapts to dark mode for good contrast
  const iconColor = suggested?.color?.[isDark ? 'dark' : 'light'] || getWeatherColor(condition, isDark);

  // For dark mode use a subdued background so the colored icon remains visible
  const backgroundColor = isDark ? (suggested?.bgColor?.dark ?? '#0b1220') : (suggested?.bgColor?.light ?? fallback.bgColor);

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
