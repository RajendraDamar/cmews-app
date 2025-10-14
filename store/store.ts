import { create } from 'zustand';

// Location data structure
export interface Location {
  provinsi: string;
  kota: string;
  kecamatan: string;
}

// User preferences state
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'id' | 'en';
  notificationsEnabled: boolean;
  favoriteLocations: string[];
}

// App state interface
export interface AppState {
  // Selected location for weather display
  selectedLocation: string | null;
  setSelectedLocation: (location: string | null) => void;

  // Selected location for forecast display
  selectedForecastLocation: Location | null;
  setSelectedForecastLocation: (location: Location | null) => void;

  // User preferences
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;

  // Add/remove favorite locations
  addFavoriteLocation: (location: string) => void;
  removeFavoriteLocation: (location: string) => void;

  // Reset all state
  reset: () => void;
}

// Default preferences
const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  language: 'id',
  notificationsEnabled: true,
  favoriteLocations: [],
};

// Default forecast location
const DEFAULT_FORECAST_LOCATION: Location = {
  provinsi: 'DKI Jakarta',
  kota: 'Jakarta Pusat',
  kecamatan: 'Menteng',
};

// Zustand store
export const useStore = create<AppState>((set) => ({
  selectedLocation: null,
  selectedForecastLocation: DEFAULT_FORECAST_LOCATION,
  preferences: DEFAULT_PREFERENCES,

  setSelectedLocation: (location) => set({ selectedLocation: location }),

  setSelectedForecastLocation: (location) => set({ selectedForecastLocation: location }),

  updatePreferences: (newPreferences) =>
    set((state) => ({
      preferences: { ...state.preferences, ...newPreferences },
    })),

  addFavoriteLocation: (location) =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        favoriteLocations: [...state.preferences.favoriteLocations, location],
      },
    })),

  removeFavoriteLocation: (location) =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        favoriteLocations: state.preferences.favoriteLocations.filter((loc) => loc !== location),
      },
    })),

  reset: () =>
    set({
      selectedLocation: null,
      selectedForecastLocation: DEFAULT_FORECAST_LOCATION,
      preferences: DEFAULT_PREFERENCES,
    }),
}));

