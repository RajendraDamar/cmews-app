import { create } from 'zustand';
import { RealBMKGService } from '~/lib/services/RealBMKGService';
import { CacheService } from '~/lib/services/CacheService';
import { processBMKGForecast, getCurrentWeather } from '~/lib/utils/bmkg-processor';
import type { ProcessedForecastEntry, BMKGLocation } from '~/lib/types/bmkg-api-types';

/**
 * Weather store state interface
 * Manages weather data, early warnings, and maritime information
 */
interface WeatherState {
  // Data
  currentWeather: ProcessedForecastEntry | null;
  forecast: ProcessedForecastEntry[][]; // 3 arrays of 8 items each
  earlyWarnings: any[];
  maritimeWeather: any[];
  location: BMKGLocation | null;

  // UI State
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  selectedWilayah: string; // Current ADM4 code

  // Actions
  fetchWeatherData: (adm4Code: string) => Promise<void>;
  fetchEarlyWarnings: () => Promise<void>;
  fetchMaritimeData: () => Promise<void>;
  refreshAllData: (adm4Code: string) => Promise<void>;
  setSelectedWilayah: (adm4Code: string) => void;
  clearError: () => void;
}

// Service instances
const bmkgService = new RealBMKGService();
const cacheService = new CacheService();

// Initialize cache on module load
cacheService.init().catch((error) => {
  console.warn('Failed to initialize cache service:', error);
});

/**
 * Weather store with real BMKG backend integration
 * Replaces mock data with actual API calls and caching
 */
export const useWeatherStore = create<WeatherState>((set, get) => ({
  // Initial state
  currentWeather: null,
  forecast: [],
  earlyWarnings: [],
  maritimeWeather: [],
  location: null,
  loading: false,
  error: null,
  lastUpdated: null,
  selectedWilayah: '3171031001', // Jakarta Pusat default

  /**
   * Fetch weather forecast data for a specific region
   * Uses caching to reduce API calls (30-minute TTL)
   */
  fetchWeatherData: async (adm4Code: string) => {
    set({ loading: true, error: null });

    try {
      const cacheKey = `weather-${adm4Code}`;
      let weatherData = await cacheService.get(cacheKey);

      // Fetch from API if cache miss
      if (!weatherData) {
        const rawData = await bmkgService.getWeatherForecast(adm4Code);
        weatherData = processBMKGForecast(rawData);
        await cacheService.set(cacheKey, weatherData, 1800000); // 30 min cache
      }

      // Validate exactly 3 days of data
      const validForecast = weatherData.dailyForecasts.slice(0, 3);

      // Extract current weather from first forecast entry
      const current = getCurrentWeather(weatherData);

      set({
        currentWeather: current,
        forecast: validForecast,
        location: weatherData.location,
        lastUpdated: weatherData.lastUpdated,
        selectedWilayah: adm4Code,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Weather fetch failed',
        loading: false,
      });
    }
  },

  /**
   * Fetch early warning and earthquake data
   * No caching for real-time alerts
   */
  fetchEarlyWarnings: async () => {
    try {
      const cacheKey = 'early-warnings';
      let warnings = await cacheService.get(cacheKey);

      if (!warnings) {
        const rawWarnings = await bmkgService.getEarlyWarning();
        warnings = rawWarnings;
        // Shorter cache for warnings (10 minutes)
        await cacheService.set(cacheKey, warnings, 600000);
      }

      set({ earlyWarnings: warnings ? [warnings] : [] });
    } catch (error) {
      console.warn('Early warnings fetch failed:', error);
      set({ earlyWarnings: [] });
    }
  },

  /**
   * Fetch maritime weather data
   * Uses caching with 30-minute TTL
   */
  fetchMaritimeData: async () => {
    try {
      const cacheKey = 'maritime-weather';
      let maritime = await cacheService.get(cacheKey);

      if (!maritime) {
        const rawMaritime = await bmkgService.getMaritimeWeather();
        maritime = rawMaritime;
        await cacheService.set(cacheKey, maritime, 1800000); // 30 min cache
      }

      set({ maritimeWeather: maritime?.data || [] });
    } catch (error) {
      console.warn('Maritime data fetch failed:', error);
      set({ maritimeWeather: [] });
    }
  },

  /**
   * Refresh all data sources
   * Useful for pull-to-refresh functionality
   */
  refreshAllData: async (adm4Code: string) => {
    const { fetchWeatherData, fetchEarlyWarnings, fetchMaritimeData } = get();

    // Fetch all data in parallel for better performance
    await Promise.all([
      fetchWeatherData(adm4Code),
      fetchEarlyWarnings(),
      fetchMaritimeData(),
    ]);
  },

  /**
   * Set the selected region code
   * Triggers weather data fetch for the new region
   */
  setSelectedWilayah: (adm4Code: string) => {
    set({ selectedWilayah: adm4Code });
    // Auto-fetch weather data for the new location
    get().fetchWeatherData(adm4Code);
  },

  /**
   * Clear error state
   * Useful for dismissing error messages
   */
  clearError: () => {
    set({ error: null });
  },
}));
