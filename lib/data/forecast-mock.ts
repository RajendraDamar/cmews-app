import type {
  ForecastData,
  WeatherForecastDay,
  WindForecastData,
  WaveForecastData,
  CurrentForecastData,
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

// Generate hourly weather data (8 entries, 3-hour intervals)
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

// Generate 7 days of weather forecast
function generateWeatherForecast(): WeatherForecastDay[] {
  const forecast: WeatherForecastDay[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dayIndex = date.getDay();
    const hourlyData = generateHourlyWeather();
    const temps = hourlyData.map((h) => h.temp);

    forecast.push({
      day: INDONESIAN_DAYS[dayIndex],
      date: date.toISOString(),
      weather: WEATHER_CONDITIONS[Math.floor(Math.random() * WEATHER_CONDITIONS.length)],
      tempMin: Math.min(...temps),
      tempMax: Math.max(...temps),
      hourly: hourlyData,
    });
  }

  return forecast;
}

// Generate wind forecast for a single location (7 days)
function generateWindForecast(): WindForecastData[] {
  const forecast: WindForecastData[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
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
      day: INDONESIAN_DAYS[dayIndex],
      date: date.toISOString(),
      direction,
      speedMin,
      speedMax,
      hourly,
    });
  }

  return forecast;
}

// Generate wave forecast for a single location (7 days)
function generateWaveForecast(): WaveForecastData[] {
  const forecast: WaveForecastData[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
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
      day: INDONESIAN_DAYS[dayIndex],
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

// Generate current forecast for a single location (7 days)
function generateCurrentForecast(): CurrentForecastData[] {
  const forecast: CurrentForecastData[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
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
      day: INDONESIAN_DAYS[dayIndex],
      date: date.toISOString(),
      speed,
      direction,
      hourly,
    });
  }

  return forecast;
}

// Export mock forecast data
export const mockForecastData: ForecastData = {
  weather: generateWeatherForecast(),
  wind: generateWindForecast(),
  wave: generateWaveForecast(),
  current: generateCurrentForecast(),
};
