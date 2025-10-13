import type {
  MaritimeData,
  WeatherDataPoint,
  WindData,
  WaveData,
  CurrentData,
  SeaState,
  CurrentStrength,
} from '../types/maritime';

// Indonesian sea areas
export const SEA_AREAS = [
  'Laut Jawa',
  'Selat Sunda',
  'Laut Natuna',
  'Selat Karimata',
  'Laut Banda',
  'Selat Makassar',
  'Laut Flores',
  'Teluk Bone',
  'Laut Sawu',
  'Laut Arafura',
];

// Weather conditions in Indonesian
const WEATHER_CONDITIONS = [
  'Cerah',
  'Cerah Berawan',
  'Berawan',
  'Berawan Tebal',
  'Hujan Ringan',
  'Hujan Sedang',
  'Hujan Lebat',
];

// Cardinal directions in Indonesian
const DIRECTIONS = [
  { name: 'Utara', degrees: 0 },
  { name: 'Timur Laut', degrees: 45 },
  { name: 'Timur', degrees: 90 },
  { name: 'Tenggara', degrees: 135 },
  { name: 'Selatan', degrees: 180 },
  { name: 'Barat Daya', degrees: 225 },
  { name: 'Barat', degrees: 270 },
  { name: 'Barat Laut', degrees: 315 },
];

// Helper function to get random direction
function getRandomDirection() {
  const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
  return { name: dir.name, degrees: dir.degrees + Math.floor(Math.random() * 30) - 15 };
}

// Helper to determine sea state from wave height
function getSeaState(height: number): SeaState {
  if (height < 0.5) return 'Tenang';
  if (height < 1.25) return 'Berombak';
  if (height < 2.5) return 'Sedang';
  if (height < 4) return 'Kasar';
  return 'Sangat Kasar';
}

// Helper to determine current strength
function getCurrentStrength(speed: number): CurrentStrength {
  if (speed < 0.25) return 'Lemah';
  if (speed < 0.5) return 'Sedang';
  if (speed < 1) return 'Kuat';
  return 'Sangat Kuat';
}

// Generate weather data for different timeframes
function generateWeatherData(timeframe: '24h' | '3d' | '7d'): WeatherDataPoint[] {
  const data: WeatherDataPoint[] = [];
  let intervals: number;
  let intervalHours: number;

  switch (timeframe) {
    case '24h':
      intervals = 8; // 3-hour intervals
      intervalHours = 3;
      break;
    case '3d':
      intervals = 12; // 6-hour intervals
      intervalHours = 6;
      break;
    case '7d':
      intervals = 14; // 12-hour intervals
      intervalHours = 12;
      break;
  }

  const baseDate = new Date();

  for (let i = 0; i < intervals; i++) {
    const datetime = new Date(baseDate.getTime() + i * intervalHours * 60 * 60 * 1000);
    const hour = datetime.getHours();
    const isDaytime = hour >= 6 && hour < 18;

    data.push({
      datetime: datetime.toISOString(),
      temperature: Math.round(24 + Math.random() * 8 + (isDaytime ? 2 : -2)),
      humidity: Math.round(60 + Math.random() * 30),
      precipitation: Math.round(Math.random() * 60),
      uvIndex: isDaytime ? Math.floor(Math.random() * 8) + 3 : 0,
      condition: WEATHER_CONDITIONS[Math.floor(Math.random() * WEATHER_CONDITIONS.length)],
    });
  }

  return data;
}

// Generate wind data for sea areas
function generateWindData(): WindData[] {
  const data: WindData[] = [];
  const baseDate = new Date();

  SEA_AREAS.forEach((seaArea) => {
    const direction = getRandomDirection();
    const speedMin = Math.round(10 + Math.random() * 15);
    const speedMax = speedMin + Math.round(5 + Math.random() * 10);
    const avgSpeed = (speedMin + speedMax) / 2;
    const beaufortScale = Math.min(12, Math.floor(avgSpeed / 5));

    data.push({
      seaArea,
      direction: direction.name,
      directionDegrees: direction.degrees,
      speedMin,
      speedMax,
      beaufortScale,
      gusts: speedMax + Math.round(Math.random() * 10),
      timestamp: baseDate.toISOString(),
    });
  });

  return data;
}

// Generate wave data for sea areas
function generateWaveData(): WaveData[] {
  const data: WaveData[] = [];
  const baseDate = new Date();

  SEA_AREAS.forEach((seaArea) => {
    const heightMin = Math.round((0.5 + Math.random() * 1.5) * 10) / 10;
    const heightMax = heightMin + Math.round((0.5 + Math.random() * 2) * 10) / 10;
    const significantHeight = Math.round(((heightMin + heightMax) / 2) * 10) / 10;
    const direction = getRandomDirection();

    data.push({
      seaArea,
      heightMin,
      heightMax,
      significantHeight,
      period: Math.round(4 + Math.random() * 8),
      direction: direction.name,
      seaState: getSeaState(significantHeight),
      timestamp: baseDate.toISOString(),
    });
  });

  return data;
}

// Generate current data for sea areas
function generateCurrentData(): CurrentData[] {
  const data: CurrentData[] = [];
  const baseDate = new Date();

  SEA_AREAS.forEach((seaArea) => {
    const direction = getRandomDirection();
    const speed = Math.round((0.1 + Math.random() * 0.9) * 100) / 100;

    data.push({
      seaArea,
      speed,
      direction: direction.name,
      directionDegrees: direction.degrees,
      strength: getCurrentStrength(speed),
      timestamp: baseDate.toISOString(),
    });
  });

  return data;
}

// Main mock data export
export const MARITIME_MOCK_DATA: MaritimeData = {
  weather: {
    timeframe: '24h',
    data: generateWeatherData('24h'),
  },
  wind: generateWindData(),
  wave: generateWaveData(),
  current: generateCurrentData(),
};

// Export data generators for dynamic timeframe changes
export const getWeatherData = generateWeatherData;
export const getWindData = generateWindData;
export const getWaveData = generateWaveData;
export const getCurrentData = generateCurrentData;

// BMKG API-compatible export for service layer
// This matches the structure expected by MockBMKGService
export const mockMaritimeWeather = {
  perairan: SEA_AREAS.map((seaArea, index) => {
    const waveData = generateWaveData()[index];
    const windData = generateWindData()[index];
    const weatherData = generateWeatherData('24h')[index];

    return {
      code: `ID${String(index + 1).padStart(3, '0')}`,
      wilayah: seaArea,
      weather: weatherData?.condition || 'Cerah Berawan',
      wave_cat: waveData.seaState,
      wave_desc: `${waveData.heightMin} - ${waveData.heightMax} m`,
      wind_speed_min: windData.speedMin,
      wind_speed_max: windData.speedMax,
      warning_desc: waveData.significantHeight > 2.5 ? 'Gelombang tinggi' : null,
    };
  }),
};

