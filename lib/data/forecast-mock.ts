import type {
  ForecastData,
  LocationForecastData,
  WeatherForecastDay,
  WindForecastDay,
  WaveForecastDay,
  CurrentForecastDay,
  HourlyWeatherData,
} from '../types/forecast';

// Indonesian day names
const INDONESIAN_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

// Weather conditions
const WEATHER_CONDITIONS = [
  'Cerah',
  'Cerah Berawan',
  'Berawan',
  'Berawan Tebal',
  'Hujan Ringan',
  'Hujan Sedang',
  'Hujan Lebat',
];

// Indonesian sea areas and regions
const LOCATIONS = [
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

// Directions
const DIRECTIONS = [
  'Utara',
  'Timur Laut',
  'Timur',
  'Tenggara',
  'Selatan',
  'Barat Daya',
  'Barat',
  'Barat Laut',
];

// Generate hourly weather data (8 entries, 3-hour intervals starting from 00:00)
function generateHourlyWeather(): HourlyWeatherData[] {
  const hourly: HourlyWeatherData[] = [];
  const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];

  for (const time of hours) {
    hourly.push({
      time,
      weather: WEATHER_CONDITIONS[Math.floor(Math.random() * WEATHER_CONDITIONS.length)],
      temp: Math.round(25 + Math.random() * 8),
      humidity: Math.round(60 + Math.random() * 30),
    });
  }

  return hourly;
}

// Generate 3 days of weather forecast for a location
function generateWeatherForecast(): WeatherForecastDay[] {
  const forecast: WeatherForecastDay[] = [];
  const today = new Date();

  for (let i = 0; i < 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dayIndex = date.getDay();
    const hourlyData = generateHourlyWeather();
    const temps = hourlyData.map((h) => h.temp);

    forecast.push({
      day: i === 0 ? 'Hari Ini' : INDONESIAN_DAYS[dayIndex],
      date: date.toISOString(),
      weather: WEATHER_CONDITIONS[Math.floor(Math.random() * WEATHER_CONDITIONS.length)],
      tempMin: Math.min(...temps),
      tempMax: Math.max(...temps),
      hourly: hourlyData,
    });
  }

  return forecast;
}

// Generate 3 days of wind forecast for a location
function generateWindForecast(): WindForecastDay[] {
  const forecast: WindForecastDay[] = [];
  const today = new Date();

  for (let i = 0; i < 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dayIndex = date.getDay();
    const speedMin = Math.round(10 + Math.random() * 20);
    const speedMax = speedMin + Math.round(5 + Math.random() * 15);
    const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];

    const hourly = [];
    const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
    for (const time of hours) {
      hourly.push({
        time,
        speed: Math.round(speedMin + Math.random() * (speedMax - speedMin)),
        direction: DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)],
      });
    }

    forecast.push({
      day: i === 0 ? 'Hari Ini' : INDONESIAN_DAYS[dayIndex],
      date: date.toISOString(),
      direction,
      speedMin,
      speedMax,
      hourly,
    });
  }

  return forecast;
}

// Generate 3 days of wave forecast for a location
function generateWaveForecast(): WaveForecastDay[] {
  const forecast: WaveForecastDay[] = [];
  const today = new Date();

  for (let i = 0; i < 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dayIndex = date.getDay();
    const heightMin = Math.round((0.5 + Math.random() * 2) * 10) / 10;
    const heightMax = heightMin + Math.round((0.3 + Math.random() * 1.5) * 10) / 10;
    const avgHeight = (heightMin + heightMax) / 2;

    // Determine sea state based on average height
    let seaState: string;
    if (avgHeight < 0.5) seaState = 'Tenang';
    else if (avgHeight < 1.25) seaState = 'Berombak';
    else if (avgHeight < 2.5) seaState = 'Sedang';
    else if (avgHeight < 4) seaState = 'Kasar';
    else seaState = 'Sangat Kasar';

    const hourly = [];
    const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
    for (const time of hours) {
      hourly.push({
        time,
        height: Math.round((heightMin + Math.random() * (heightMax - heightMin)) * 10) / 10,
      });
    }

    forecast.push({
      day: i === 0 ? 'Hari Ini' : INDONESIAN_DAYS[dayIndex],
      date: date.toISOString(),
      heightMin,
      heightMax,
      period: Math.round(4 + Math.random() * 6),
      seaState,
      hourly,
    });
  }

  return forecast;
}

// Generate 3 days of current forecast for a location
function generateCurrentForecast(): CurrentForecastDay[] {
  const forecast: CurrentForecastDay[] = [];
  const today = new Date();

  for (let i = 0; i < 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dayIndex = date.getDay();
    const speed = Math.round((0.2 + Math.random() * 0.8) * 100) / 100;
    const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];

    const hourly = [];
    const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
    for (const time of hours) {
      hourly.push({
        time,
        speed: Math.round((speed - 0.1 + Math.random() * 0.2) * 100) / 100,
        direction: DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)],
      });
    }

    forecast.push({
      day: i === 0 ? 'Hari Ini' : INDONESIAN_DAYS[dayIndex],
      date: date.toISOString(),
      speed,
      direction,
      hourly,
    });
  }

  return forecast;
}

// Generate forecast data for a specific location
function generateLocationForecast(location: string): LocationForecastData {
  return {
    location,
    weather: generateWeatherForecast(),
    wind: generateWindForecast(),
    wave: generateWaveForecast(),
    current: generateCurrentForecast(),
  };
}

// Export mock forecast data with location-based structure
export const mockForecastData: ForecastData = {
  locations: LOCATIONS.reduce(
    (acc, location) => {
      acc[location] = generateLocationForecast(location);
      return acc;
    },
    {} as { [key: string]: LocationForecastData }
  ),
  availableLocations: LOCATIONS,
};
