// Maritime calculations and utilities

import type { SeaState, CurrentStrength } from '../types/maritime';

// Convert Beaufort scale to description
export function beaufortToDescription(scale: number): string {
  const descriptions = [
    'Tenang',
    'Tenang',
    'Berombak Ringan',
    'Berombak',
    'Agak Berombak',
    'Sedang',
    'Agak Kasar',
    'Kasar',
    'Kasar',
    'Sangat Kasar',
    'Badai',
    'Badai Kuat',
    'Badai Topan',
  ];
  return descriptions[Math.min(scale, 12)] || 'Tidak Diketahui';
}

// Get color class for sea state
export function getSeaStateColor(state: SeaState): string {
  switch (state) {
    case 'Tenang':
      return 'text-green-600 dark:text-green-400';
    case 'Berombak':
      return 'text-blue-600 dark:text-blue-400';
    case 'Sedang':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'Kasar':
      return 'text-orange-600 dark:text-orange-400';
    case 'Sangat Kasar':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
}

// Get badge variant for sea state
export function getSeaStateBadgeVariant(state: SeaState): 'default' | 'secondary' | 'destructive' {
  switch (state) {
    case 'Tenang':
    case 'Berombak':
      return 'secondary';
    case 'Sedang':
      return 'default';
    case 'Kasar':
    case 'Sangat Kasar':
      return 'destructive';
    default:
      return 'default';
  }
}

// Get color class for current strength
export function getCurrentStrengthColor(strength: CurrentStrength): string {
  switch (strength) {
    case 'Lemah':
      return 'text-green-600 dark:text-green-400';
    case 'Sedang':
      return 'text-blue-600 dark:text-blue-400';
    case 'Kuat':
      return 'text-orange-600 dark:text-orange-400';
    case 'Sangat Kuat':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
}

// Get badge variant for current strength
export function getCurrentStrengthBadgeVariant(
  strength: CurrentStrength
): 'default' | 'secondary' | 'destructive' {
  switch (strength) {
    case 'Lemah':
    case 'Sedang':
      return 'secondary';
    case 'Kuat':
      return 'default';
    case 'Sangat Kuat':
      return 'destructive';
    default:
      return 'default';
  }
}

// Check if wave height is dangerous
export function isDangerousWaveHeight(height: number): boolean {
  return height >= 2.5;
}

// Check if current is strong
export function isStrongCurrent(speed: number): boolean {
  return speed >= 0.5;
}

// Check if wind is high
export function isHighWind(speed: number): boolean {
  return speed >= 25;
}

// Get wind speed color based on value
export function getWindSpeedColor(speed: number): string {
  if (speed < 15) return 'text-green-600 dark:text-green-400';
  if (speed < 25) return 'text-blue-600 dark:text-blue-400';
  if (speed < 40) return 'text-yellow-600 dark:text-yellow-400';
  if (speed < 60) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

// Get wave height color based on value
export function getWaveHeightColor(height: number): string {
  if (height < 0.5) return 'text-green-600 dark:text-green-400';
  if (height < 1.25) return 'text-blue-600 dark:text-blue-400';
  if (height < 2.5) return 'text-yellow-600 dark:text-yellow-400';
  if (height < 4) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

// Format direction degrees to cardinal direction
export function degreesToCardinal(degrees: number): string {
  const directions = [
    'Utara',
    'Timur Laut',
    'Timur',
    'Tenggara',
    'Selatan',
    'Barat Daya',
    'Barat',
    'Barat Laut',
  ];
  const index = Math.round(((degrees % 360) / 45) % 8);
  return directions[index];
}
