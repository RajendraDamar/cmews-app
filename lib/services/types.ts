// Type definitions for BMKG service layer
// These interfaces match BMKG API response structures for future-ready implementation

// Weather forecast types
export interface WeatherForecastData {
  utc_datetime: string;
  local_datetime: string;
  t: number; // Temperature °C
  hu: number; // Humidity %
  weather_desc: string; // Indonesian description
  weather_desc_en: string; // English description
  ws: number; // Wind speed km/h
  wd: string; // Wind direction
  tcc: number; // Cloud coverage %
  vs_text: string; // Visibility km
}

export interface WeatherForecastResponse {
  data: WeatherForecastData[];
}

// Early warning types
export interface EarlyWarningData {
  wilayah: string;
  level: 'Normal' | 'Waspada' | 'Siaga' | 'Awas';
  cuaca: string;
  warning_desc: string;
  valid_from: string;
  valid_to: string;
}

export interface EarlyWarningResponse {
  peringatan: EarlyWarningData[];
}

// Maritime weather types
export interface MaritimeWeatherData {
  code: string;
  wilayah: string;
  weather: string;
  wave_cat: string; // Wave category: Rendah, Sedang, Tinggi
  wave_desc: string; // Wave height description
  wind_speed_min: number;
  wind_speed_max: number;
  warning_desc: string | null;
}

export interface MaritimeWeatherResponse {
  perairan: MaritimeWeatherData[];
}

// Service interface that both mock and real implementations will follow
export interface BMKGServiceInterface {
  getWeatherForecast(wilayahCode: string): Promise<WeatherForecastResponse>;
  getEarlyWarning(wilayahCode?: string): Promise<EarlyWarningResponse>;
  getMaritimeWeather(): Promise<MaritimeWeatherResponse>;
}

// Storage service types
export interface UserPreferences {
  favoriteLocations: string[];
  notificationSettings: {
    enabled: boolean;
    warningTypes: string[];
  };
  theme: 'light' | 'dark' | 'system';
  language: 'id' | 'en';
}

export interface StorageServiceInterface {
  saveUserPreferences(preferences: UserPreferences): Promise<void>;
  getUserPreferences(): Promise<UserPreferences | null>;
  clearUserData(): Promise<void>;
}
