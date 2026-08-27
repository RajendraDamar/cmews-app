// Mock BMKG Weather Data
// Based on BMKG API structure: https://api.bmkg.go.id/publik/prakiraan-cuaca

import type {
  BMKGWeatherData,
  LocationOption,
  WeatherAlert,
  BMKGLocation,
  BMKGHourlyData,
  BMKGDailyData,
} from '~/lib/types/weather';
import { formatToBMKGDateTime } from '~/lib/utils/indonesian-locale';

/**
 * Format date to BMKG API datetime format: "YYYY-MM-DD HH:mm:ss"
 * This matches the real BMKG API response structure
 */
function formatToBMKGAPIDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

// Indonesian Provinces with Cities and Districts
export const MOCK_LOCATIONS: LocationOption[] = [
  {
    provinsi: 'D.I. Yogyakarta',
    cities: [
      {
        name: 'Kota Yogyakarta',
        districts: ['Danurejan', 'Gondomanan', 'Kraton', 'Malioboro', 'Kotagede'],
      },
      {
        name: 'Kabupaten Bantul',
        districts: ['Kretek (Parangtritis)', 'Sanden (Samas)', 'Srandakan (Pandansimo)', 'Bantul', 'Sewon'],
      },
      {
        name: 'Kabupaten Gunungkidul',
        districts: ['Tanjungsari (Baron & Drini)', 'Tepus (Indrayanti & Timang)', 'Girisubo (Wediombo)', 'Panggang (Gesing)', 'Wonosari'],
      },
      {
        name: 'Kabupaten Kulon Progo',
        districts: ['Temon (Glagah & YIA)', 'Panjatan (Bugel)', 'Galur (Trisik)', 'Wates', 'Pengasih'],
      },
      {
        name: 'Kabupaten Sleman',
        districts: ['Pakem (Kaliurang)', 'Cangkringan (Merapi)', 'Prambanan', 'Depok', 'Mlati'],
      },
    ],
  },
  {
    provinsi: 'DKI Jakarta',
    cities: [
      {
        name: 'Jakarta Pusat',
        districts: ['Menteng', 'Tanah Abang', 'Gambir'],
      },
      {
        name: 'Jakarta Selatan',
        districts: ['Kebayoran Baru', 'Cilandak', 'Setiabudi'],
      },
    ],
  },
  {
    provinsi: 'Jawa Tengah',
    cities: [
      {
        name: 'Semarang',
        districts: ['Semarang Tengah', 'Semarang Barat', 'Candisari'],
      },
      {
        name: 'Surakarta (Solo)',
        districts: ['Banjarsari', 'Laweyan', 'Pasar Kliwon'],
      },
      {
        name: 'Magelang',
        districts: ['Magelang Tengah', 'Borobudur', 'Mertoyudan'],
      },
    ],
  },
  {
    provinsi: 'Jawa Timur',
    cities: [
      {
        name: 'Surabaya',
        districts: ['Wonokromo', 'Gubeng', 'Tegalsari'],
      },
    ],
  },
  {
    provinsi: 'Bali',
    cities: [
      {
        name: 'Denpasar',
        districts: ['Denpasar Barat', 'Denpasar Timur', 'Denpasar Selatan'],
      },
    ],
  },
];

// Weather conditions in Indonesian
const WEATHER_CONDITIONS = [
  { code: '1', description: 'Cerah' },
  { code: '3', description: 'Cerah Berawan' },
  { code: '4', description: 'Berawan' },
  { code: '5', description: 'Hujan Ringan' },
  { code: '7', description: 'Hujan Sedang' },
  { code: '10', description: 'Hujan Lebat' },
  { code: '21', description: 'Petir' },
  { code: '35', description: 'Kabut' },
];

// Indonesian wind directions
const WIND_DIRECTIONS = [
  'Utara',
  'Timur Laut',
  'Timur',
  'Tenggara',
  'Selatan',
  'Barat Daya',
  'Barat',
  'Barat Laut',
];

/**
 * Generate hourly forecast data for next 24 hours (3-hour intervals)
 * Returns exactly 24 entries (3 days × 8 per day) as per BMKG API structure
 */
function generateHourlyForecast(): BMKGHourlyData[] {
  const hourlyData: BMKGHourlyData[] = [];
  const now = new Date();

  // Generate exactly 24 forecasts (3 days × 8 per day) with 3-hour intervals
  for (let i = 0; i < 24; i++) {
    const forecastTime = new Date(now.getTime() + i * 3 * 60 * 60 * 1000);
    const hour = forecastTime.getHours();

    // Temperature varies by time of day - realistic Indonesian climate (20-35°C)
    let temp = 25 + Math.random() * 5;
    if (hour >= 6 && hour < 12) temp += 2;
    if (hour >= 12 && hour < 16) temp += 5;
    if (hour >= 22 || hour < 6) temp -= 3;

    // Select weather based on hour
    let weatherCondition;
    if (hour >= 6 && hour < 18) {
      weatherCondition = WEATHER_CONDITIONS[Math.floor(Math.random() * 4)];
    } else {
      weatherCondition = WEATHER_CONDITIONS[Math.floor(Math.random() * 3)];
    }

    hourlyData.push({
      datetime: formatToBMKGDateTime(forecastTime),
      temperature: Math.round(temp),
      humidity: Math.round(60 + Math.random() * 30),
      windDirection: WIND_DIRECTIONS[Math.floor(Math.random() * WIND_DIRECTIONS.length)],
      windSpeed: Math.round(5 + Math.random() * 15),
      weather: weatherCondition,
    });
  }

  return hourlyData;
}

/**
 * Generate daily forecast for next 7 days
 */
function generateDailyForecast(): BMKGDailyData[] {
  const dailyData: BMKGDailyData[] = [];
  const now = new Date();

  for (let i = 0; i < 7; i++) {
    const forecastDate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const baseTemp = 27 + Math.random() * 5;

    const weatherCondition =
      WEATHER_CONDITIONS[Math.floor(Math.random() * WEATHER_CONDITIONS.length)];

    dailyData.push({
      date: formatToBMKGDateTime(forecastDate).substring(0, 8),
      tempMax: Math.round(baseTemp + 3),
      tempMin: Math.round(baseTemp - 4),
      humidity: Math.round(60 + Math.random() * 25),
      weather: weatherCondition,
      precipitation: weatherCondition.code >= '5' ? Math.round(Math.random() * 80 + 20) : 0,
    });
  }

  return dailyData;
}

// Default location: Kota Yogyakarta
export const DEFAULT_LOCATION: BMKGLocation = {
  provinsi: 'D.I. Yogyakarta',
  kota: 'Kota Yogyakarta',
  kecamatan: 'Danurejan',
  lat: -7.7956,
  lon: 110.3695,
};

// Mock current weather data for D.I. Yogyakarta
export const MOCK_BMKG_WEATHER: BMKGWeatherData = {
  location: DEFAULT_LOCATION,
  lastUpdated: formatToBMKGDateTime(new Date()),
  currentWeather: {
    temperature: 29,
    feelsLike: 32,
    weather: { code: '3', description: 'Cerah Berawan' },
    humidity: 75,
    windDirection: 'Selatan',
    windSpeed: 14,
  },
  hourlyForecast: generateHourlyForecast(),
  dailyForecast: generateDailyForecast(),
};

// Mock weather alerts for DIY
export const MOCK_WEATHER_ALERTS: WeatherAlert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Peringatan Gelombang Tinggi Pesisir Selatan DIY',
    description:
      'Waspada potensi gelombang laut tinggi 2.5 - 4.0 meter di perairan Samudera Hindia selatan D.I. Yogyakarta (Kulon Progo, Bantul, Gunungkidul).',
    validFrom: formatToBMKGDateTime(new Date()),
    validTo: formatToBMKGDateTime(new Date(Date.now() + 24 * 60 * 60 * 1000)),
  },
];

/**
 * Get weather data for a specific location
 */
export function getWeatherForLocation(
  provinsi: string,
  kota: string,
  kecamatan: string
): BMKGWeatherData {
  // Find location
  const province = MOCK_LOCATIONS.find((p) => p.provinsi === provinsi);
  const city = province?.cities.find((c) => c.name === kota);

  if (!city || !city.districts.includes(kecamatan)) {
    return MOCK_BMKG_WEATHER;
  }

  // Generate mock coordinates around DIY
  const lat = -7.75 + (Math.random() - 0.5) * 0.4;
  const lon = 110.37 + (Math.random() - 0.5) * 0.4;

  // Generate random weather variations for different locations
  const baseTemp = 25 + Math.random() * 8;
  const weatherCondition =
    WEATHER_CONDITIONS[Math.floor(Math.random() * WEATHER_CONDITIONS.length)];

  return {
    location: {
      provinsi,
      kota,
      kecamatan,
      lat,
      lon,
    },
    lastUpdated: formatToBMKGDateTime(new Date()),
    currentWeather: {
      temperature: Math.round(baseTemp),
      feelsLike: Math.round(baseTemp + 3),
      weather: weatherCondition,
      humidity: Math.round(60 + Math.random() * 30),
      windDirection: WIND_DIRECTIONS[Math.floor(Math.random() * WIND_DIRECTIONS.length)],
      windSpeed: Math.round(5 + Math.random() * 20),
    },
    hourlyForecast: generateHourlyForecast(),
    dailyForecast: generateDailyForecast(),
  };
}

// Export mock weather data
export const mockWeatherData = {
  location: DEFAULT_LOCATION,
  current: {
    datetime: formatToBMKGDateTime(new Date()),
    t: 29, // temperature
    hu: 75, // humidity
    weather: 'Cerah Berawan',
    wd: 'Selatan', // wind direction
    ws: 14, // wind speed
  },
  hourly: generateHourlyForecast().slice(0, 24).map((h) => ({
      time: h.datetime,
      temp: h.temperature,
      humidity: h.humidity,
      weather: h.weather.description,
    })),
  daily: generateDailyForecast().map((d) => ({
    day: new Date(
      parseInt(d.date.substring(0, 4)),
      parseInt(d.date.substring(4, 6)) - 1,
      parseInt(d.date.substring(6, 8))
    ).toLocaleDateString('id-ID', { weekday: 'long' }),
    date: d.date,
    tempMin: d.tempMin,
    tempMax: d.tempMax,
    weather: d.weather.description,
  })),
};

// BMKG API-compatible export for service layer
// Returns exactly 24 forecast entries (3 days × 8 per day) with 3-hour intervals
export const mockWeatherForecast = {
  data: (() => {
    const forecasts = [];
    const now = new Date();
    
    // Generate exactly 24 forecasts (3 days × 8 per day) with 3-hour intervals
    for (let i = 0; i < 24; i++) {
      const forecastTime = new Date(now.getTime() + i * 3 * 60 * 60 * 1000);
      const hour = forecastTime.getHours();
      
      // Temperature: 22-32°C realistic range for DIY
      let temp = 23 + Math.random() * 9;
      if (hour >= 6 && hour < 12) temp += 2;
      if (hour >= 12 && hour < 16) temp += 3;
      if (hour >= 22 || hour < 6) temp -= 2;
      
      // Select weather based on hour
      let weatherCondition;
      if (hour >= 6 && hour < 18) {
        weatherCondition = WEATHER_CONDITIONS[Math.floor(Math.random() * 4)];
      } else {
        weatherCondition = WEATHER_CONDITIONS[Math.floor(Math.random() * 3)];
      }
      
      // Calculate UTC time (Indonesia is UTC+7)
      const utcTime = new Date(forecastTime.getTime() - 7 * 60 * 60 * 1000);
      
      forecasts.push({
        utc_datetime: formatToBMKGAPIDateTime(utcTime),
        local_datetime: formatToBMKGAPIDateTime(forecastTime),
        t: Math.round(temp),
        hu: Math.round(55 + Math.random() * 30), // 55-85% humidity
        weather_desc: weatherCondition.description,
        weather_desc_en: weatherCondition.description,
        ws: Math.round(8 + Math.random() * 16), // 8-24 km/h wind speed
        wd: WIND_DIRECTIONS[Math.floor(Math.random() * WIND_DIRECTIONS.length)],
        tcc: Math.round(30 + Math.random() * 50), // 30-80% cloud coverage
        vs_text: '10', // Visibility in km
        image: `${weatherCondition.code}.png`,
      });
    }
    
    return forecasts;
  })(),
  lokasi: {
    adm1: 'D.I. Yogyakarta',
    adm2: 'Kota Yogyakarta',
    adm3: 'Danurejan',
    adm4: 'Danurejan',
    koord: '-7.7956,110.3695',
  },
};
