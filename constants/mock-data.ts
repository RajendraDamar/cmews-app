export const MOCK_APPS = [
  { id: '1', name: 'Instagram', category: 'Social', rating: 4.5 },
  { id: '2', name: 'TikTok', category: 'Entertainment', rating: 4.7 },
  { id: '3', name: 'WhatsApp', category: 'Communication', rating: 4.6 },
  { id: '4', name: 'Spotify', category: 'Music', rating: 4.8 },
];

export const MOCK_BOOKS = [
  { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', rating: 4.3 },
  { id: '2', title: '1984', author: 'George Orwell', rating: 4.6 },
  { id: '3', title: 'To Kill a Mockingbird', author: 'Harper Lee', rating: 4.5 },
];

export const MOCK_MAP_PLACES = [
  { id: '1', name: 'Central Park', address: 'New York, NY', lat: 40.785091, lon: -73.968285 },
  { id: '2', name: 'Times Square', address: 'Manhattan, NY', lat: 40.758896, lon: -73.98513 },
  { id: '3', name: 'Brooklyn Bridge', address: 'Brooklyn, NY', lat: 40.706086, lon: -73.996864 },
  { id: '4', name: 'Statue of Liberty', address: 'New York, NY', lat: 40.689247, lon: -74.044502 },
];

// Weather mock data
export const MOCK_TODAY_WEATHER = {
  location: 'New York, NY',
  currentTemp: 18,
  feelsLike: 15,
  condition: 'Partly Cloudy',
  high: 22,
  low: 12,
  humidity: 65,
  windSpeed: 12,
  uvIndex: 5,
  visibility: 10,
  pressure: 1013,
};

export const MOCK_HOURLY_FORECAST = [
  { time: '09:00', temp: 15, icon: 'partly-sunny', precipitation: 10 },
  { time: '12:00', temp: 18, icon: 'sunny', precipitation: 5 },
  { time: '15:00', temp: 22, icon: 'sunny', precipitation: 0 },
  { time: '18:00', temp: 19, icon: 'partly-sunny', precipitation: 15 },
  { time: '21:00', temp: 16, icon: 'cloudy-night', precipitation: 20 },
  { time: '00:00', temp: 13, icon: 'cloudy-night', precipitation: 25 },
];

// 3-day forecast with 3-hour intervals (48 data points)
export const MOCK_3DAY_FORECAST = Array.from({ length: 3 }, (_, dayIndex) => {
  const date = new Date();
  date.setDate(date.getDate() + dayIndex);

  return {
    date: date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
    hourly: Array.from({ length: 8 }, (_, hourIndex) => {
      const hour = hourIndex * 3;
      const temp = 10 + Math.random() * 15 + (hour > 6 && hour < 18 ? 5 : 0);

      return {
        time: `${hour.toString().padStart(2, '0')}:00`,
        temp: Math.round(temp),
        icon: hour >= 6 && hour < 18 ? 'sunny' : 'cloudy-night',
        precipitation: Math.round(Math.random() * 30),
        humidity: Math.round(60 + Math.random() * 30),
        windSpeed: Math.round(5 + Math.random() * 15),
      };
    }),
  };
});
