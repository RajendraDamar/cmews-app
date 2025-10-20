// BMKG API Type Definitions
// Real API response structures from BMKG official endpoints
// https://api.bmkg.go.id/publik/prakiraan-cuaca

/**
 * Individual weather forecast entry from BMKG API
 * BMKG returns 24 entries (3 days × 8 per day, 3-hour intervals)
 */
export interface BMKGWeatherEntry {
  utc_datetime: string; // "2025-10-20 05:00:00"
  local_datetime: string; // "2025-10-20 12:00:00"
  t: number; // Temperature °C
  hu: number; // Humidity %
  weather_desc: string; // "Berawan Tebal" (Indonesian)
  weather_desc_en: string; // "Overcast" (English)
  ws: number; // Wind speed km/h
  wd: string; // Wind direction "Timur Laut"
  tcc: number; // Total cloud coverage %
  vs_text: string; // Visibility "10"
  image: string; // Weather icon filename
}

/**
 * Location information from BMKG API
 */
export interface BMKGLocation {
  adm1: string; // Province (Provinsi)
  adm2: string; // Regency/City (Kabupaten/Kota)
  adm3: string; // District (Kecamatan)
  adm4: string; // Village/Sub-district code
  koord: string; // Coordinates "lat,lon"
}

/**
 * Complete BMKG weather forecast API response
 */
export interface BMKGWeatherAPIResponse {
  data: BMKGWeatherEntry[];
  lokasi: BMKGLocation;
}

/**
 * Processed forecast entry after transformation
 */
export interface ProcessedForecastEntry {
  datetime: string;
  timestamp: number;
  temperature: number;
  humidity: number;
  weatherDesc: string;
  weatherDescEn: string;
  windSpeed: number;
  windDirection: string;
  cloudCover: number;
  visibility: string;
  weatherIcon: string;
}

/**
 * Processed forecast response with grouped daily data
 */
export interface ProcessedForecastResponse {
  location: BMKGLocation;
  dailyForecasts: ProcessedForecastEntry[][]; // 3 days, 8 entries per day
  totalForecasts: number; // Should be 24
  lastUpdated: string;
}

/**
 * Early warning/earthquake data from BMKG
 */
export interface BMKGEarlyWarningResponse {
  Infogempa?: {
    gempa?: {
      Tanggal: string;
      Jam: string;
      DateTime: string;
      Coordinates: string;
      Lintang: string;
      Bujur: string;
      Magnitude: string;
      Kedalaman: string;
      Wilayah: string;
      Potensi: string;
      Dirasakan?: string;
      Shakemap?: string;
    };
  };
}

/**
 * Maritime weather data from BMKG
 */
export interface BMKGMaritimeResponse {
  data?: {
    wilayah: string;
    cuaca: string;
    tinggi_gelombang: string;
    kecepatan_angin: string;
    arah_angin: string;
    warning?: string;
  }[];
}
