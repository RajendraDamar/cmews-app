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

// Mock early warning data prioritizing D.I. Yogyakarta & Coastal South Java
export const mockEarlyWarning: EarlyWarningResponse = {
  peringatan: [
    {
      wilayah: 'Pesisir Selatan D.I. Yogyakarta (Kulon Progo, Bantul, Gunungkidul)',
      level: 'Siaga',
      cuaca: 'Gelombang Tinggi & Angin Kencang',
      warning_desc:
        'Peringatan gelombang laut tinggi 2.5 - 4.0 meter disertai hembusan angin kencang hingga 35 knot di pesisir selatan DIY. Nelayan dan wisatawan diimbau waspada pasang.',
      valid_from: formatToBMKGAPIDateTime(new Date(Date.now() - 2 * 60 * 60 * 1000)),
      valid_to: formatToBMKGAPIDateTime(new Date(Date.now() + 22 * 60 * 60 * 1000)),
    },
    {
      wilayah: 'D.I. Yogyakarta (Sleman, Kota Yogyakarta, Bantul Utara)',
      level: 'Waspada',
      cuaca: 'Hujan Lebat Disertai Petir',
      warning_desc: 'Potensi hujan lebat disertai kilat/petir dan angin kencang berdurasi singkat di kawasan Sleman dan Kota Yogyakarta pada siang hingga sore hari.',
      valid_from: formatToBMKGAPIDateTime(new Date()),
      valid_to: formatToBMKGAPIDateTime(new Date(Date.now() + 24 * 60 * 60 * 1000)),
    },
    {
      wilayah: 'Kawasan Lereng Gunung Merapi (Sleman)',
      level: 'Siaga',
      cuaca: 'Hujan Deras Puncak Merapi',
      warning_desc: 'Potensi aliran lahar hujan pada sungai-sungai yang berhulu di Gunung Merapi akibat curah hujan tinggi di bagian hulu.',
      valid_from: formatToBMKGAPIDateTime(new Date(Date.now() - 1 * 60 * 60 * 1000)),
      valid_to: formatToBMKGAPIDateTime(new Date(Date.now() + 20 * 60 * 60 * 1000)),
    },
    {
      wilayah: 'Jawa Tengah Bagian Selatan',
      level: 'Waspada',
      cuaca: 'Hujan Sedang - Lebat',
      warning_desc: 'Potensi hujan sedang hingga lebat di wilayah Kebumen, Purworejo, hingga perbatasan Kulon Progo.',
      valid_from: formatToBMKGAPIDateTime(new Date(Date.now() - 4 * 60 * 60 * 1000)),
      valid_to: formatToBMKGAPIDateTime(new Date(Date.now() + 20 * 60 * 60 * 1000)),
    },
    {
      wilayah: 'DKI Jakarta',
      level: 'Normal',
      cuaca: 'Cerah Berawan',
      warning_desc: 'Kondisi cuaca cerah berawan, nihil peringatan dini cuaca ekstrem signifikan.',
      valid_from: formatToBMKGAPIDateTime(new Date(Date.now() - 12 * 60 * 60 * 1000)),
      valid_to: formatToBMKGAPIDateTime(new Date(Date.now() + 12 * 60 * 60 * 1000)),
    },
  ],
};

// Mock service method
export async function getEarlyWarning(wilayahCode?: string): Promise<EarlyWarningResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

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
