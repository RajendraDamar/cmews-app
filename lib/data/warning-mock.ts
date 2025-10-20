// Mock BMKG Early Warning Data
// Based on BMKG API structure: https://api.bmkg.go.id/publik/peringatan-dini

/**
 * Format date to BMKG API datetime format: "YYYY-MM-DD HH:mm:ss"
 */
function formatToBMKGAPIDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export interface EarlyWarning {
  wilayah: string;
  level: 'Normal' | 'Waspada' | 'Siaga' | 'Awas';
  cuaca: string;
  warning_desc: string;
  valid_from: string;
  valid_to: string;
}

export interface EarlyWarningResponse {
  peringatan: EarlyWarning[];
}

// Mock early warning data for various regions
export const mockEarlyWarning: EarlyWarningResponse = {
  peringatan: [
    {
      wilayah: 'DI Yogyakarta',
      level: 'Waspada',
      cuaca: 'Hujan Lebat',
      warning_desc: 'Potensi hujan lebat dengan intensitas 20-50 mm dalam 24 jam',
      valid_from: formatToBMKGAPIDateTime(new Date(Date.now() - 2 * 60 * 60 * 1000)),
      valid_to: formatToBMKGAPIDateTime(new Date(Date.now() + 22 * 60 * 60 * 1000)),
    },
    {
      wilayah: 'DKI Jakarta',
      level: 'Siaga',
      cuaca: 'Hujan Lebat Disertai Angin Kencang',
      warning_desc:
        'Potensi hujan lebat dengan intensitas 50-100 mm dan angin kencang 30-40 km/jam dalam 24 jam',
      valid_from: formatToBMKGAPIDateTime(new Date()),
      valid_to: formatToBMKGAPIDateTime(new Date(Date.now() + 24 * 60 * 60 * 1000)),
    },
    {
      wilayah: 'Jawa Barat',
      level: 'Waspada',
      cuaca: 'Hujan Sedang',
      warning_desc: 'Potensi hujan sedang dengan intensitas 10-20 mm dalam 24 jam',
      valid_from: formatToBMKGAPIDateTime(new Date(Date.now() - 4 * 60 * 60 * 1000)),
      valid_to: formatToBMKGAPIDateTime(new Date(Date.now() + 20 * 60 * 60 * 1000)),
    },
    {
      wilayah: 'Bali',
      level: 'Normal',
      cuaca: 'Cerah Berawan',
      warning_desc: 'Tidak ada peringatan cuaca ekstrem',
      valid_from: formatToBMKGAPIDateTime(new Date(Date.now() - 12 * 60 * 60 * 1000)),
      valid_to: formatToBMKGAPIDateTime(new Date(Date.now() + 12 * 60 * 60 * 1000)),
    },
    {
      wilayah: 'Sulawesi Selatan',
      level: 'Waspada',
      cuaca: 'Hujan Lebat',
      warning_desc: 'Potensi hujan lebat dengan intensitas 20-50 mm dalam 24 jam',
      valid_from: formatToBMKGAPIDateTime(new Date(Date.now() + 1 * 60 * 60 * 1000)),
      valid_to: formatToBMKGAPIDateTime(new Date(Date.now() + 25 * 60 * 60 * 1000)),
    },
    {
      wilayah: 'Jawa Tengah',
      level: 'Normal',
      cuaca: 'Hujan Ringan',
      warning_desc: 'Potensi hujan ringan dengan intensitas di bawah 10 mm',
      valid_from: formatToBMKGAPIDateTime(new Date(Date.now() - 12 * 60 * 60 * 1000)),
      valid_to: formatToBMKGAPIDateTime(new Date(Date.now() + 12 * 60 * 60 * 1000)),
    },
  ],
};

// Mock service method
export async function getEarlyWarning(wilayahCode?: string): Promise<EarlyWarningResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (wilayahCode) {
    // Filter warnings for specific region
    const filteredWarnings = mockEarlyWarning.peringatan.filter(
      (warning) => warning.wilayah.toLowerCase().includes(wilayahCode.toLowerCase())
    );
    return {
      peringatan: filteredWarnings.length > 0 ? filteredWarnings : mockEarlyWarning.peringatan,
    };
  }

  return mockEarlyWarning;
}
