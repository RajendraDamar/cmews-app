// Indonesian Wilayah Code Mapping
// Maps major Indonesian cities to their official BMKG wilayah codes
// Format: {City Name: 'wilayah_code'}
// Wilayah codes follow Indonesian administrative hierarchy (Province-Regency-District-Village: XX.XX.XX.XXXX)

export const WILAYAH_CODES: Record<string, string> = {
  'Jakarta Pusat': '31.71.03.1001',
  'Jakarta Selatan': '31.71.02.1001',
  'Jakarta Utara': '31.71.01.1001',
  'Yogyakarta': '34.71.01.1001',
  'Surabaya': '35.78.01.1001',
  'Bandung': '32.73.01.1001',
  'Medan': '12.71.01.1001',
  'Denpasar': '51.71.01.1001',
};

// City coordinates for distance-based location matching
export const CITY_COORDINATES: {
  name: string;
  lat: number;
  lon: number;
  code: string;
}[] = [
  { name: 'Jakarta Pusat', lat: -6.1944, lon: 106.8229, code: '31.71.03.1001' },
  { name: 'Jakarta Selatan', lat: -6.2614, lon: 106.8106, code: '31.71.02.1001' },
  { name: 'Jakarta Utara', lat: -6.1385, lon: 106.8634, code: '31.71.01.1001' },
  { name: 'Yogyakarta', lat: -7.7956, lon: 110.3695, code: '34.71.01.1001' },
  { name: 'Surabaya', lat: -7.2575, lon: 112.7521, code: '35.78.01.1001' },
  { name: 'Bandung', lat: -6.9175, lon: 107.6191, code: '32.73.01.1001' },
  { name: 'Medan', lat: 3.5952, lon: 98.6722, code: '12.71.01.1001' },
  { name: 'Denpasar', lat: -8.6705, lon: 115.2126, code: '51.71.01.1001' },
];
