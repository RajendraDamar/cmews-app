import { View } from 'react-native';
import React from 'react';
import { CloudRain, CloudDrizzle, Sun, Wind, Cloud } from 'lucide-react-native';
import { WeatherReport } from '~/lib/types/weather-report';

interface SeverityMarkerProps {
  report: WeatherReport;
  selected?: boolean;
  zoom?: number;
}

export const getSeverityColor = (severity?: string) => {
  switch (severity?.toLowerCase()) {
    case 'high':
    case 'tinggi':
      return '#EF4444';
    case 'medium':
    case 'sedang':
      return '#F59E0B';
    case 'low':
    case 'rendah':
    default:
      return '#10B981';
  }
};

export const getWeatherIcon = (weather: string) => {
  const lowerWeather = (weather || '').toLowerCase();
  if (lowerWeather.includes('hujan lebat')) return CloudRain;
  if (lowerWeather.includes('hujan')) return CloudDrizzle;
  if (lowerWeather.includes('cerah')) return Sun;
  if (lowerWeather.includes('kabut') || lowerWeather.includes('angin')) return Wind;
  return Cloud;
};

export function SeverityMarker({ report, selected = false, zoom = 11 }: SeverityMarkerProps) {
  const color = getSeverityColor(report?.severity);
  const IconComponent = getWeatherIcon(report?.weather || '');
  
  let markerSize = 36;
  let borderWidth = 2;
  let showIcon = true;
  
  if (selected) {
    markerSize = 44;
    borderWidth = 3.5;
    showIcon = true;
  } else if (zoom < 7) {
    markerSize = 12;
    borderWidth = 0;
    showIcon = false;
  } else if (zoom < 10) {
    markerSize = 24;
    borderWidth = 1;
    showIcon = false;
  }

  const borderRadius = markerSize / 2;

  return (
    <View
      pointerEvents="none"
      style={{
        width: 64, // INCREASED to prevent clipping of the 44px scaled marker and shadow
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {/* Core marker circle with high-contrast white border and native hardware-accelerated shadows */}
      <View
        style={{
          width: markerSize,
          height: markerSize,
          borderRadius: borderRadius,
          backgroundColor: color,
          borderWidth: borderWidth,
          borderColor: '#FFFFFF',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: "#000",
          shadowOffset: { width: 0, height: selected ? 4 : 2 },
          shadowOpacity: selected ? 0.3 : 0.25,
          shadowRadius: selected ? 6 : 3.84,
          elevation: selected ? 8 : 5,
        }}>
        {showIcon && <IconComponent size={selected ? 22 : 19} color="#FFFFFF" strokeWidth={2.5} />}
      </View>
    </View>
  );
}
