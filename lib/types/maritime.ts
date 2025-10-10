// Maritime data types for Weather & Maritime Dashboard

export type Timeframe = '24h' | '3d' | '7d';

export type SeaState = 'Tenang' | 'Berombak' | 'Sedang' | 'Kasar' | 'Sangat Kasar';

export type CurrentStrength = 'Lemah' | 'Sedang' | 'Kuat' | 'Sangat Kuat';

export interface WeatherDataPoint {
  datetime: string;
  temperature: number;
  humidity: number;
  precipitation: number;
  uvIndex: number;
  condition: string;
}

export interface WeatherForecast {
  timeframe: Timeframe;
  data: WeatherDataPoint[];
}

export interface WindData {
  seaArea: string;
  direction: string; // "Timur Laut", "Barat", etc.
  directionDegrees: number; // 0-360
  speedMin: number; // km/h
  speedMax: number; // km/h
  beaufortScale: number; // 0-12
  gusts: number;
  timestamp: string;
}

export interface WaveData {
  seaArea: string;
  heightMin: number; // meters
  heightMax: number; // meters
  significantHeight: number;
  period: number; // seconds
  direction: string;
  seaState: SeaState;
  timestamp: string;
}

export interface CurrentData {
  seaArea: string;
  speed: number; // m/s
  direction: string; // "Barat Daya", etc.
  directionDegrees: number; // 0-360
  strength: CurrentStrength;
  timestamp: string;
}

export interface MaritimeData {
  weather: WeatherForecast;
  wind: WindData[];
  wave: WaveData[];
  current: CurrentData[];
}
