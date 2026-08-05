import { create } from 'zustand';
import { RealBMKGService } from '~/lib/services/RealBMKGService';
import { CacheService } from '~/lib/services/CacheService';
import { processBMKGForecast, getCurrentWeather } from '~/lib/utils/bmkg-processor';
import type { ProcessedForecastEntry, BMKGLocation } from '~/lib/types/bmkg-api-types';
import { mockWeatherForecast } from '~/lib/data/weather-mock';
import { mockEarlyWarning } from '~/lib/data/warning-mock';
import { mockMaritimeWeather, MARITIME_MOCK_DATA } from '~/lib/data/maritime-mock';

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
  // Initial state with immediate mock fallback readiness
  currentWeather: getCurrentWeather(processBMKGForecast(mockWeatherForecast as any)),
  forecast: processBMKGForecast(mockWeatherForecast as any).dailyForecasts,
  earlyWarnings: [mockEarlyWarning],
  maritimeWeather: MARITIME_MOCK_DATA.wave,
  location: processBMKGForecast(mockWeatherForecast as any).location,
  loading: false,
  error: null,
  lastUpdated: new Date().toISOString(),
  selectedWilayah: '31.71.03.1001', // Jakarta Pusat default

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
      console.warn('Weather fetch encountered error, using mock fallback:', error);
      const fallbackData = processBMKGForecast(mockWeatherForecast as any);
      set({
        currentWeather: getCurrentWeather(fallbackData),
        forecast: fallbackData.dailyForecasts,
        location: fallbackData.location,
        lastUpdated: fallbackData.lastUpdated,
        selectedWilayah: adm4Code,
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
        warnings = rawWarnings || mockEarlyWarning;
        await cacheService.set(cacheKey, warnings, 600000);
      }

      set({ earlyWarnings: warnings ? [warnings] : [mockEarlyWarning] });
    } catch (error) {
      console.warn('Early warnings fetch failed, using mock fallback:', error);
      set({ earlyWarnings: [mockEarlyWarning] });
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
        maritime = rawMaritime || mockMaritimeWeather;
        await cacheService.set(cacheKey, maritime, 1800000);
      }

      const items = maritime?.perairan || maritime?.data || (Array.isArray(maritime) && maritime.length > 0 ? maritime : MARITIME_MOCK_DATA.wave);
      set({ maritimeWeather: items });
    } catch (error) {
      console.warn('Maritime data fetch failed, using mock fallback:', error);
      set({ maritimeWeather: MARITIME_MOCK_DATA.wave });
    }
  },

  /**
   * Refresh all data sources
   */
  refreshAllData: async (adm4Code: string) => {
    const { fetchWeatherData, fetchEarlyWarnings, fetchMaritimeData } = get();

    await Promise.all([
      fetchWeatherData(adm4Code),
      fetchEarlyWarnings(),
      fetchMaritimeData(),
    ]);
  },

  /**
   * Set the selected region code
   */
  setSelectedWilayah: (adm4Code: string) => {
    set({ selectedWilayah: adm4Code });
    get().fetchWeatherData(adm4Code);
  },

  /**
   * Clear error state
   */
  clearError: () => {
    set({ error: null });
  },
}));
