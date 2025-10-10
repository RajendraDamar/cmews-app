// Indonesian locale utilities for date/time formatting

export const INDONESIAN_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const INDONESIAN_MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const INDONESIAN_MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

/**
 * Format date to Indonesian format: DD MMMM YYYY
 * Example: 10 Oktober 2025
 */
export function formatIndonesianDate(date: Date): string {
  const day = date.getDate();
  const month = INDONESIAN_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Format date to short Indonesian format: DD MMM YYYY
 * Example: 10 Okt 2025
 */
export function formatIndonesianDateShort(date: Date): string {
  const day = date.getDate();
  const month = INDONESIAN_MONTHS_SHORT[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Get Indonesian day name from date
 * Example: Senin
 */
export function getIndonesianDayName(date: Date): string {
  return INDONESIAN_DAYS[date.getDay()];
}

/**
 * Format time to 24-hour format
 * Example: 14:30
 */
export function formatTime24(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Parse BMKG datetime format (YYYYMMDDHHmm) to Date
 * Example: 202510101430 -> Date
 */
export function parseBMKGDateTime(dateTimeStr: string): Date {
  const year = parseInt(dateTimeStr.substring(0, 4));
  const month = parseInt(dateTimeStr.substring(4, 6)) - 1;
  const day = parseInt(dateTimeStr.substring(6, 8));
  const hour = parseInt(dateTimeStr.substring(8, 10));
  const minute = parseInt(dateTimeStr.substring(10, 12));
  return new Date(year, month, day, hour, minute);
}

/**
 * Format date to BMKG format (YYYYMMDDHHmm)
 * Example: Date -> 202510101430
 */
export function formatToBMKGDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${year}${month}${day}${hour}${minute}`;
}

/**
 * Get relative time in Indonesian
 * Example: "2 jam yang lalu", "30 menit yang lalu"
 */
export function getRelativeTimeIndonesian(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return 'Baru saja';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} menit yang lalu`;
  } else if (diffHours < 24) {
    return `${diffHours} jam yang lalu`;
  } else if (diffDays === 1) {
    return 'Kemarin';
  } else if (diffDays < 7) {
    return `${diffDays} hari yang lalu`;
  } else {
    return formatIndonesianDateShort(date);
  }
}
