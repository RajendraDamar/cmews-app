// Indonesian Wilayah Code Mapping
// Maps Indonesian cities and DIY regencies to their official BMKG wilayah codes
// Format: {City Name: 'wilayah_code'}
// Wilayah codes follow Indonesian administrative hierarchy (Province-Regency-District-Village: XX.XX.XX.XXXX)

export const WILAYAH_CODES: Record<string, string> = {
  'Kota Yogyakarta': '34.71.01.1001',
  'Kabupaten Sleman': '34.04.01.1001',
  'Kabupaten Bantul': '34.02.01.1001',
  'Kabupaten Gunungkidul': '34.03.01.1001',
  'Kabupaten Kulon Progo': '34.01.01.1001',
  'Pesisir Parangtritis': '34.02.04.2001',
  'Pesisir Glagah (YIA)': '34.01.02.2001',
  'Pesisir Baron & Drini': '34.03.07.2001',
  'Jakarta Pusat': '31.71.03.1001',
  'Surabaya': '35.78.01.1001',
  'Bandung': '32.73.01.1001',
  'Medan': '12.71.01.1001',
  'Denpasar': '51.71.01.1001',
};

// City and regional coordinates for distance-based location matching
export const CITY_COORDINATES: {
  name: string;
  lat: number;
  lon: number;
  code: string;
}[] = [
  { name: 'Kota Yogyakarta', lat: -7.7956, lon: 110.3695, code: '34.71.01.1001' },
  { name: 'Kabupaten Sleman', lat: -7.7175, lon: 110.3589, code: '34.04.01.1001' },
  { name: 'Kabupaten Bantul', lat: -7.8894, lon: 110.3294, code: '34.02.01.1001' },
  { name: 'Kabupaten Gunungkidul', lat: -7.9656, lon: 110.6033, code: '34.03.01.1001' },
  { name: 'Kabupaten Kulon Progo', lat: -7.8569, lon: 110.1589, code: '34.01.01.1001' },
  { name: 'Pesisir Parangtritis', lat: -8.0255, lon: 110.3168, code: '34.02.04.2001' },
  { name: 'Pesisir Glagah (YIA)', lat: -7.9142, lon: 110.0747, code: '34.01.02.2001' },
  { name: 'Pesisir Baron & Drini', lat: -8.1289, lon: 110.5489, code: '34.03.07.2001' },
  { name: 'Jakarta Pusat', lat: -6.1944, lon: 106.8229, code: '31.71.03.1001' },
  { name: 'Surabaya', lat: -7.2575, lon: 112.7521, code: '35.78.01.1001' },
  { name: 'Bandung', lat: -6.9175, lon: 107.6191, code: '32.73.01.1001' },
  { name: 'Medan', lat: 3.5952, lon: 98.6722, code: '12.71.01.1001' },
  { name: 'Denpasar', lat: -8.6705, lon: 115.2126, code: '51.71.01.1001' },
];
