// Color constants for theming
export const COLORS = {
  weather: {
    sunny: 'hsl(45 93% 47%)', // yellow-500
    cloudy: 'hsl(215 20% 65%)', // gray-400
    rainy: 'hsl(217 91% 60%)', // blue-500
    stormy: 'hsl(271 76% 53%)', // purple-500
  },
  severity: {
    low: 'hsl(142 76% 36%)', // green-600
    warning: 'hsl(48 96% 53%)', // yellow-500
    medium: 'hsl(33 100% 50%)', // orange-500
    high: 'hsl(0 84% 60%)', // red-500
  },
  chart: {
    temperature: 'hsl(33 100% 50%)', // orange-500
    humidity: 'hsl(217 91% 60%)', // blue-500
    wind: 'hsl(173 80% 40%)', // teal-600
    precipitation: 'hsl(217 91% 60%)', // blue-500
    current: 'hsl(239 84% 67%)', // indigo-400
  },
  precipitation: {
    light: 'hsl(199 89% 48%)', // sky-500 (<30%)
    medium: 'hsl(217 91% 60%)', // blue-500 (30-70%)
    dark: 'hsl(221 83% 53%)', // blue-600 (>70%)
  },
  // FAB button icon colors (light colors for contrast against primary background)
  fabIcon: {
    dark: 'hsl(210 40% 98%)', // Very light for dark mode
    light: 'hsl(0 0% 100%)', // Pure white for light mode
  },
};

// UI Constants
export const UI_CONSTANTS = {
  imageAspectRatio: 16 / 9, // Standard widescreen aspect ratio for images
};

// Theme-aware color utilities
export const getThemeColor = (isDark: boolean) => ({
  primary: isDark ? '#60a5fa' : '#3b82f6', // blue-400/blue-500
  primaryForeground: isDark ? '#09090b' : '#fafafa', // zinc-950/zinc-50
  muted: isDark ? '#9ca3af' : '#6b7280', // gray-400/gray-500
  mutedForeground: isDark ? '#9ca3af' : '#6b7280',
  foreground: isDark ? '#f3f4f6' : '#1f2937', // gray-100/gray-800
  card: isDark ? '#1f2937' : '#ffffff',
  border: isDark ? '#374151' : '#e5e7eb',
  shadow: '#000',
  // Icon colors
  icon: {
    primary: isDark ? '#60a5fa' : '#3b82f6',
    muted: isDark ? '#9ca3af' : '#6b7280',
    foreground: isDark ? '#e5e7eb' : '#1f2937',
  },
  // Provide chart color tokens so components can use themeColors.chart?.{temperature,humidity,wind,precipitation,current}
  chart: {
    temperature: COLORS.chart.temperature,
    humidity: COLORS.chart.humidity,
    wind: COLORS.chart.wind,
    precipitation: COLORS.chart.precipitation,
    current: COLORS.chart.current,
  },
});

export const getPrecipitationColor = (percentage: number): string => {
  if (percentage < 30) return COLORS.precipitation.light;
  if (percentage <= 70) return COLORS.precipitation.medium;
  return COLORS.precipitation.dark;
};

// Direction map for arrows
export const DIRECTION_MAP: Record<string, number> = {
  Utara: 0,
  'Timur Laut': 45,
  Timur: 90,
  Tenggara: 135,
  Selatan: 180,
  'Barat Daya': 225,
  Barat: 270,
  'Barat Laut': 315,
};

// Map style URLs for MapLibre
export const MAP_STYLES = {
  dark: 'https://tiles.openfreemap.org/styles/dark',
  light: 'https://tiles.openfreemap.org/styles/bright',
};

// Navigation colors (used for sidebars and bottom tab background)
export const NAV_COLORS = {
  darkBg: 'hsl(222.2 84% 4.9%)',
  lightBg: 'hsl(0 0% 100%)',
  darkBorder: 'hsl(217.2 32.6% 17.5%)',
  lightBorder: 'hsl(214.3 31.8% 91.4%)',
};
