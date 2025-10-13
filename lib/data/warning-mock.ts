// Mock BMKG Early Warning Data
// Based on BMKG API structure: https://api.bmkg.go.id/publik/peringatan-dini

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
      valid_from: '2025-10-12 12:00:00',
      valid_to: '2025-10-13 12:00:00',
    },
    {
      wilayah: 'DKI Jakarta',
      level: 'Siaga',
      cuaca: 'Hujan Lebat Disertai Angin Kencang',
      warning_desc:
        'Potensi hujan lebat dengan intensitas 50-100 mm dan angin kencang 30-40 km/jam dalam 24 jam',
      valid_from: '2025-10-12 14:00:00',
      valid_to: '2025-10-13 14:00:00',
    },
    {
      wilayah: 'Jawa Barat',
      level: 'Waspada',
      cuaca: 'Hujan Sedang',
      warning_desc: 'Potensi hujan sedang dengan intensitas 10-20 mm dalam 24 jam',
      valid_from: '2025-10-12 10:00:00',
      valid_to: '2025-10-13 10:00:00',
    },
    {
      wilayah: 'Bali',
      level: 'Normal',
      cuaca: 'Cerah Berawan',
      warning_desc: 'Tidak ada peringatan cuaca ekstrem',
      valid_from: '2025-10-12 00:00:00',
      valid_to: '2025-10-13 00:00:00',
    },
    {
      wilayah: 'Sulawesi Selatan',
      level: 'Waspada',
      cuaca: 'Hujan Lebat',
      warning_desc: 'Potensi hujan lebat dengan intensitas 20-50 mm dalam 24 jam',
      valid_from: '2025-10-12 15:00:00',
      valid_to: '2025-10-13 15:00:00',
    },
    {
      wilayah: 'Jawa Tengah',
      level: 'Normal',
      cuaca: 'Hujan Ringan',
      warning_desc: 'Potensi hujan ringan dengan intensitas di bawah 10 mm',
      valid_from: '2025-10-12 00:00:00',
      valid_to: '2025-10-13 00:00:00',
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
