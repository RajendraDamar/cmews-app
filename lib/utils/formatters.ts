/**
 * Data Formatting Utilities
 * Standardizes number rounding and display values across forecast & weather components.
 */

/**
 * Format temperature to an integer string with degree symbol (e.g., "28°")
 */
export function formatTemp(val: number | null | undefined): string {
  if (val == null || isNaN(val)) return '-';
  return `${Math.round(val)}°`;
}

/**
 * Format temperature to an integer number (e.g., 28)
 */
export function formatTempNumber(val: number | null | undefined, fallback = 0): number {
  if (val == null || isNaN(val)) return fallback;
  return Math.round(val);
}

/**
 * Format wave height to 1 decimal place string (e.g., "1.2")
 */
export function formatWaveHeight(val: number | null | undefined): string {
  if (val == null || isNaN(val)) return '0.0';
  return Number(val.toFixed(1)).toString();
}

/**
 * Format current speed to 2 decimal places string (e.g., "0.45")
 */
export function formatCurrentSpeed(val: number | null | undefined): string {
  if (val == null || isNaN(val)) return '0.00';
  return Number(val.toFixed(2)).toString();
}

/**
 * Format wind speed to an integer string (e.g., "15")
 */
export function formatWindSpeed(val: number | null | undefined): string {
  if (val == null || isNaN(val)) return '0';
  return Math.round(val).toString();
}

/**
 * Format humidity percentage string (e.g., "75%")
 */
export function formatHumidity(val: number | null | undefined): string {
  if (val == null || isNaN(val)) return '0%';
  return `${Math.round(val)}%`;
}
