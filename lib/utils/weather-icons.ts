// Map BMKG weather icon codes to Lucide icons and colors
import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Wind,
  type LucideIcon,
} from 'lucide-react-native';

export interface WeatherIconInfo {
  icon: LucideIcon;
  color: {
    light: string;
    dark: string;
  };
  description: string;
}

/**
 * Map BMKG icon codes (1-45) to Lucide icons
 * Based on BMKG weather condition codes
 */
export function getWeatherIcon(code: string): WeatherIconInfo {
  const iconCode = parseInt(code);

  // 1-2: Cerah (Clear/Sunny)
  if (iconCode >= 1 && iconCode <= 2) {
    return {
      icon: Sun,
      color: { light: '#f59e0b', dark: '#fbbf24' },
      description: 'Cerah',
    };
  }

  // 3-4: Berawan (Cloudy)
  if (iconCode >= 3 && iconCode <= 4) {
    return {
      icon: Cloud,
      color: { light: '#6b7280', dark: '#9ca3af' },
      description: 'Berawan',
    };
  }

  // 5-10: Hujan (Rain)
  if (iconCode >= 5 && iconCode <= 10) {
    return {
      icon: CloudRain,
      color: { light: '#3b82f6', dark: '#60a5fa' },
      description: 'Hujan',
    };
  }

  // 11-15: Gerimis (Drizzle)
  if (iconCode >= 11 && iconCode <= 15) {
    return {
      icon: CloudDrizzle,
      color: { light: '#06b6d4', dark: '#22d3ee' },
      description: 'Gerimis',
    };
  }

  // 16-20: Salju (Snow) - rare in Indonesia
  if (iconCode >= 16 && iconCode <= 20) {
    return {
      icon: CloudSnow,
      color: { light: '#0ea5e9', dark: '#38bdf8' },
      description: 'Salju',
    };
  }

  // 21-30: Petir (Thunderstorm)
  if (iconCode >= 21 && iconCode <= 30) {
    return {
      icon: CloudLightning,
      color: { light: '#8b5cf6', dark: '#a78bfa' },
      description: 'Petir',
    };
  }

  // 31-40: Kabut (Fog)
  if (iconCode >= 31 && iconCode <= 40) {
    return {
      icon: CloudFog,
      color: { light: '#64748b', dark: '#94a3b8' },
      description: 'Kabut',
    };
  }

  // 41-45: Berangin (Windy)
  if (iconCode >= 41 && iconCode <= 45) {
    return {
      icon: Wind,
      color: { light: '#14b8a6', dark: '#2dd4bf' },
      description: 'Berangin',
    };
  }

  // Default fallback
  return {
    icon: Cloud,
    color: { light: '#6b7280', dark: '#9ca3af' },
    description: 'Tidak Diketahui',
  };
}

/**
 * Get weather description color based on condition
 */
export function getWeatherColor(condition: string, isDark: boolean): string {
  const lowerCondition = condition.toLowerCase();

  if (lowerCondition.includes('cerah')) {
    return isDark ? '#fbbf24' : '#f59e0b';
  }

  if (lowerCondition.includes('hujan')) {
    return isDark ? '#60a5fa' : '#3b82f6';
  }

  if (lowerCondition.includes('petir')) {
    return isDark ? '#a78bfa' : '#8b5cf6';
  }

  if (lowerCondition.includes('kabut')) {
    return isDark ? '#94a3b8' : '#64748b';
  }

  return isDark ? '#9ca3af' : '#6b7280';
}

/**
 * Map textual weather description to an icon component and default colors.
 * This keeps icon selection consistent across components that render a textual
 * weather description (e.g. "Cerah Berawan", "Hujan Ringan").
 */
export function getIconForDescription(description: string) {
  const desc = description.toLowerCase();

  if (desc.includes('cerah') && desc.includes('berawan')) {
    return {
      icon: CloudSun as LucideIcon | any,
      color: { light: '#f59e0b', dark: '#fbbf24' },
      bgColor: { light: '#fef3c7', dark: '#0b1220' },
      label: 'Cerah Berawan',
    };
  }

  if (desc.includes('cerah')) {
    return { icon: Sun as LucideIcon | any, color: { light: '#f59e0b', dark: '#fbbf24' }, bgColor: { light: '#fef3c7', dark: '#0b1220' }, label: 'Cerah' };
  }

  if (desc.includes('hujan') || desc.includes('gerimis')) {
    // differentiate intensity
    if (desc.includes('lebat') || desc.includes('petir')) {
      return { icon: CloudRain as LucideIcon | any, color: { light: '#3b82f6', dark: '#60a5fa' }, bgColor: { light: '#dbeafe', dark: '#0b1220' }, label: 'Hujan Lebat' };
    }
    if (desc.includes('sedang')) {
      return { icon: CloudRain as LucideIcon | any, color: { light: '#3b82f6', dark: '#60a5fa' }, bgColor: { light: '#dbeafe', dark: '#0b1220' }, label: 'Hujan Sedang' };
    }
    return { icon: CloudDrizzle as LucideIcon | any, color: { light: '#06b6d4', dark: '#22d3ee' }, bgColor: { light: '#dbeafe', dark: '#0b1220' }, label: 'Hujan Ringan' };
  }

  if (desc.includes('petir') || desc.includes('kilat')) {
    return { icon: CloudLightning as LucideIcon | any, color: { light: '#8b5cf6', dark: '#a78bfa' }, bgColor: { light: '#f3e8ff', dark: '#0b1220' }, label: 'Petir' };
  }

  if (desc.includes('kabut') || desc.includes('asap')) {
    return { icon: CloudFog as LucideIcon | any, color: { light: '#64748b', dark: '#94a3b8' }, bgColor: { light: '#f3f4f6', dark: '#0b1220' }, label: 'Kabut' };
  }

  // Fallback: cloudy
  return { icon: Cloud as LucideIcon | any, color: { light: '#6b7280', dark: '#9ca3af' }, bgColor: { light: '#f3f4f6', dark: '#0b1220' }, label: 'Berawan' };
}
