// BMKG API Weather Data Types
// Based on https://api.bmkg.go.id/publik/prakiraan-cuaca

export interface BMKGLocation {
  provinsi: string;
  kota: string;
  kecamatan: string;
  lat: number;
  lon: number;
}

export interface BMKGWeatherCondition {
  code: string; // Icon code (1-45)
  description: string; // Indonesian: Cerah, Berawan, Hujan, etc.
}

export interface BMKGHourlyData {
  datetime: string; // YYYYMMDDHHmm format
  temperature: number; // Celsius
  humidity: number; // Percentage
  windDirection: string; // Indonesian: Utara, Selatan, Timur, Barat, etc.
  windSpeed: number; // km/h
  weather: BMKGWeatherCondition;
}

export interface BMKGDailyData {
  date: string; // YYYYMMDD format
  tempMax: number;
  tempMin: number;
  humidity: number;
  weather: BMKGWeatherCondition;
  precipitation?: number; // Percentage
}

export interface BMKGWeatherData {
  location: BMKGLocation;
  lastUpdated: string;
  currentWeather: {
    temperature: number;
    feelsLike: number;
    weather: BMKGWeatherCondition;
    humidity: number;
    windDirection: string;
    windSpeed: number;
  };
  hourlyForecast: BMKGHourlyData[];
  dailyForecast: BMKGDailyData[];
}

export interface WeatherAlert {
  id: string;
  type: 'warning' | 'watch' | 'advisory';
  title: string;
  description: string;
  validFrom: string;
  validTo: string;
}

export interface LocationOption {
  provinsi: string;
  cities: {
    name: string;
    districts: string[];
  }[];
}
