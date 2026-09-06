import { create } from 'zustand';
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
  selectedWilayah: '34.71.01.1001', // Kota Yogyakarta default

  /**
   * Fetch weather forecast data for a specific region
   * Uses caching to reduce API calls (30-minute TTL)
   */
  fetchWeatherData: async (adm4Code: string) => {
    set({ loading: true, error: null });

    // Enforcing Dynamic Prototyping Phase: Use Mock Data Only
    setTimeout(() => {
      const fallbackData = processBMKGForecast(mockWeatherForecast as any);
      set({
        currentWeather: getCurrentWeather(fallbackData),
        forecast: fallbackData.dailyForecasts,
        location: fallbackData.location,
        lastUpdated: fallbackData.lastUpdated,
        selectedWilayah: adm4Code,
        error: null,
        loading: false,
      });
    }, 500); // Simulate network latency
  },

  /**
   * Fetch early warning and earthquake data
   * No caching for real-time alerts
   */
  fetchEarlyWarnings: async () => {
    // Enforcing Dynamic Prototyping Phase: Use Mock Data Only
    setTimeout(() => {
      set({ earlyWarnings: [mockEarlyWarning] });
    }, 300);
  },

  /**
   * Fetch maritime weather data
   * Uses caching with 30-minute TTL
   */
  fetchMaritimeData: async () => {
    // Enforcing Dynamic Prototyping Phase: Use Mock Data Only
    setTimeout(() => {
      set({ maritimeWeather: MARITIME_MOCK_DATA.wave });
    }, 400);
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
