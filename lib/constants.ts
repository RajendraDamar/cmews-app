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
    medium: 'hsl(33 100% 50%)', // orange-500
    high: 'hsl(0 84% 60%)', // red-500
  },
  chart: {
    temperature: 'hsl(33 100% 50%)', // orange-500
    humidity: 'hsl(217 91% 60%)', // blue-500
    wind: 'hsl(173 80% 40%)', // teal-600
    precipitation: 'hsl(217 91% 60%)', // blue-500
  },
  precipitation: {
    light: 'hsl(199 89% 48%)', // sky-500 (<30%)
    medium: 'hsl(217 91% 60%)', // blue-500 (30-70%)
    dark: 'hsl(221 83% 53%)', // blue-600 (>70%)
  },
};

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
  'Tenggara': 135,
  Selatan: 180,
  'Barat Daya': 225,
  Barat: 270,
  'Barat Laut': 315,
};
