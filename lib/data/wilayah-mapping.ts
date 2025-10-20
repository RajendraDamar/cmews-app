// Indonesian Wilayah Code Mapping
// Maps major Indonesian cities to their official BMKG wilayah codes
// Format: {City Name: 'wilayah_code'}
// Wilayah codes follow Indonesian administrative hierarchy (Province-Regency-District-Village)

export const WILAYAH_CODES: Record<string, string> = {
  'Jakarta Pusat': '3171031001',
  'Jakarta Selatan': '3171021001',
  'Jakarta Utara': '3171011001',
  'Yogyakarta': '3471011001',
  'Surabaya': '3578011001',
  'Bandung': '3273011001',
  'Medan': '1271011001',
  'Denpasar': '5171011001',
};

// City coordinates for distance-based location matching
export const CITY_COORDINATES: {
  name: string;
  lat: number;
  lon: number;
  code: string;
}[] = [
  { name: 'Jakarta Pusat', lat: -6.1944, lon: 106.8229, code: '3171031001' },
  { name: 'Jakarta Selatan', lat: -6.2614, lon: 106.8106, code: '3171021001' },
  { name: 'Jakarta Utara', lat: -6.1385, lon: 106.8634, code: '3171011001' },
  { name: 'Yogyakarta', lat: -7.7956, lon: 110.3695, code: '3471011001' },
  { name: 'Surabaya', lat: -7.2575, lon: 112.7521, code: '3578011001' },
  { name: 'Bandung', lat: -6.9175, lon: 107.6191, code: '3273011001' },
  { name: 'Medan', lat: 3.5952, lon: 98.6722, code: '1271011001' },
  { name: 'Denpasar', lat: -8.6705, lon: 115.2126, code: '5171011001' },
];
