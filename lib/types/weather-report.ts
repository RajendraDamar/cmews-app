// Weather Report Types for Maps Tab

export interface WeatherReport {
  id: string;
  location: string;
  lat: number;
  lon: number;
  weather: string;
  severity: 'low' | 'medium' | 'high';
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  notes?: string;
  photo?: string;
  user: {
    name: string;
    initials: string;
  };
  timestamp: string;
}

export type SeverityLevel = 'low' | 'medium' | 'high';

export interface WeatherReportFilters {
  all: boolean;
  low: boolean;
  medium: boolean;
  high: boolean;
}
