// BMKG Data Processor
// Transforms raw BMKG API responses into application-friendly format

import type {
  BMKGWeatherAPIResponse,
  ProcessedForecastEntry,
  ProcessedForecastResponse,
} from '~/lib/types/bmkg-api-types';

// Constants for BMKG data validation
const EXPECTED_FORECAST_ENTRIES = 24; // 3 days × 8 per day
const MAX_FORECAST_ENTRIES = 30; // Allow some flexibility for API variations
const FORECASTS_PER_DAY = 8; // 3-hour intervals
const FORECAST_DAYS = 3; // BMKG provides 3 days of forecast

/**
 * Process BMKG weather forecast API response
 * CRITICAL: BMKG returns exactly 24 entries (3 days × 8 per day, 3-hour intervals)
 * 
 * @param rawData - Raw BMKG API response
 * @returns Processed forecast with daily groupings
 */
export const processBMKGForecast = (
  rawData: BMKGWeatherAPIResponse
): ProcessedForecastResponse => {
  // Transform raw API data to processed format
  const processed: ProcessedForecastEntry[] = rawData.data.map((item) => ({
    datetime: item.local_datetime,
    timestamp: new Date(item.local_datetime).getTime(),
    temperature: item.t,
    humidity: item.hu,
    weatherDesc: item.weather_desc,
    weatherDescEn: item.weather_desc_en,
    windSpeed: item.ws,
    windDirection: item.wd,
    cloudCover: item.tcc,
    visibility: item.vs_text,
    weatherIcon: item.image,
  }));

  // Group into exactly 3 days, 8 forecasts per day (3-hour intervals)
  // 00:00, 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00
  const dailyGroups: ProcessedForecastEntry[][] = [];
  
  // BMKG API returns 24 entries total
  // Ensure we only process up to 24 entries and group them correctly
  const totalEntries = Math.min(processed.length, EXPECTED_FORECAST_ENTRIES);
  
  for (let i = 0; i < totalEntries; i += FORECASTS_PER_DAY) {
    const dayForecast = processed.slice(i, i + FORECASTS_PER_DAY);
    if (dayForecast.length > 0) {
      dailyGroups.push(dayForecast);
    }
  }

  // Ensure exactly 3 days
  const exactlyThreeDays = dailyGroups.slice(0, FORECAST_DAYS);

  return {
    location: rawData.lokasi,
    dailyForecasts: exactlyThreeDays,
    totalForecasts: processed.length,
    // Use current timestamp as data processing time
    // Note: BMKG API doesn't provide a specific "lastUpdated" field
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Validate BMKG forecast data structure
 * Ensures data meets expected format before processing
 * 
 * @param data - Raw BMKG API response
 * @returns true if valid, false otherwise
 */
export const validateBMKGForecastData = (
  data: BMKGWeatherAPIResponse
): boolean => {
  if (!data || !data.data || !Array.isArray(data.data)) {
    return false;
  }

  if (!data.lokasi || typeof data.lokasi !== 'object') {
    return false;
  }

  // BMKG should return 24 entries (3 days × 8 per day)
  // Allow some flexibility for API variations
  if (data.data.length === 0 || data.data.length > MAX_FORECAST_ENTRIES) {
    return false;
  }

  // Validate first entry has required fields
  const firstEntry = data.data[0];
  if (!firstEntry) {
    return false;
  }

  const requiredFields = [
    'local_datetime',
    't',
    'hu',
    'weather_desc',
    'weather_desc_en',
    'ws',
    'wd',
  ];

  return requiredFields.every((field) => field in firstEntry);
};

/**
 * Extract coordinates from BMKG location string
 * Format: "lat,lon" or "-6.2088,106.8456"
 * 
 * @param koord - Coordinate string from BMKG API
 * @returns Object with latitude and longitude
 */
export const parseCoordinates = (
  koord: string
): { latitude: number; longitude: number } | null => {
  try {
    const [lat, lon] = koord.split(',').map((s) => parseFloat(s.trim()));
    
    if (isNaN(lat) || isNaN(lon)) {
      return null;
    }

    return {
      latitude: lat,
      longitude: lon,
    };
  } catch (error) {
    console.error('Failed to parse coordinates:', error);
    return null;
  }
};

/**
 * Get forecast for a specific day (0-2)
 * 
 * @param processedData - Processed forecast response
 * @param dayIndex - Day index (0 = today, 1 = tomorrow, 2 = day after)
 * @returns Forecast entries for the specified day
 */
export const getForecastForDay = (
  processedData: ProcessedForecastResponse,
  dayIndex: number
): ProcessedForecastEntry[] | null => {
  if (dayIndex < 0 || dayIndex >= processedData.dailyForecasts.length) {
    return null;
  }

  return processedData.dailyForecasts[dayIndex];
};

/**
 * Get current weather from latest forecast entry
 * 
 * @param processedData - Processed forecast response
 * @returns Current weather entry (first entry from first day)
 */
export const getCurrentWeather = (
  processedData: ProcessedForecastResponse
): ProcessedForecastEntry | null => {
  const todayForecast = processedData.dailyForecasts[0];
  
  if (!todayForecast || todayForecast.length === 0) {
    return null;
  }

  // Return the first forecast entry as "current" weather
  return todayForecast[0];
};
