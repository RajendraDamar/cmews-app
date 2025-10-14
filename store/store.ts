import { create } from 'zustand';

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
  selectedForecastLocation: string | null;
  setSelectedForecastLocation: (location: string | null) => void;

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

// Zustand store
export const useStore = create<AppState>((set) => ({
  selectedLocation: null,
  selectedForecastLocation: 'Laut Jawa', // Default to first location
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
      selectedForecastLocation: 'Laut Jawa',
      preferences: DEFAULT_PREFERENCES,
    }),
}));

