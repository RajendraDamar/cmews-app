// Forecast data types for the redesigned forecast tab

export interface HourlyWeatherData {
  time: string; // "00:00", "03:00", etc.
  weather: string; // "Cerah", "Hujan Lebat", etc.
  temp: number;
  humidity: number;
}

export interface WeatherForecastDay {
  day: string; // "Senin", "Selasa", etc.
  date: string; // ISO date string
  weather: string; // Main weather condition
  tempMin: number;
  tempMax: number;
  hourly: HourlyWeatherData[];
}

export interface WindForecastData {
  day: string; // "Senin", "Selasa", etc.
  date: string; // ISO date string
  direction: string; // "Timur Laut", etc.
  speedMin: number; // km/h
  speedMax: number; // km/h
  hourly: {
    time: string;
    speed: number;
    direction: string;
  }[];
}

export interface WaveForecastData {
  day: string; // "Senin", "Selasa", etc.
  date: string; // ISO date string
  heightMin: number; // meters
  heightMax: number; // meters
  period: number; // seconds
  seaState: string; // "Tenang", "Berombak", etc.
  hourly: {
    time: string;
    height: number;
  }[];
}

export interface CurrentForecastData {
  day: string; // "Senin", "Selasa", etc.
  date: string; // ISO date string
  speed: number; // m/s
  direction: string;
  hourly: {
    time: string;
    speed: number;
    direction: string;
  }[];
}

export interface LocationForecastData {
  location: string; // "Menteng, Jakarta Pusat"
  weather: WeatherForecastDay[];
  wind: WindForecastData[];
  wave: WaveForecastData[];
  current: CurrentForecastData[];
}

export interface ForecastData {
  weather: WeatherForecastDay[];
  wind: WindForecastData[];
  wave: WaveForecastData[];
  current: CurrentForecastData[];
}
