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
  {
    id: '1',
    name: 'Central Park',
    address: '59th to 110th St, New York, NY 10022',
    lat: 40.785091,
    lon: -73.968285,
    category: 'park',
    rating: 4.8,
    reviews: 125000,
    phone: '(212) 310-6600',
    website: 'www.centralparknyc.org',
    hours: 'Open 24 hours',
    photos: ['https://via.placeholder.com/400x300'],
    priceLevel: 0,
    description:
      'Iconic urban park with walking paths, recreational facilities, and scenic landscapes.',
  },
  {
    id: '2',
    name: 'Times Square',
    address: 'Manhattan, NY 10036',
    lat: 40.758896,
    lon: -73.98513,
    category: 'landmark',
    rating: 4.5,
    reviews: 98000,
    phone: '',
    website: 'www.timessquarenyc.org',
    hours: 'Open 24 hours',
    photos: ['https://via.placeholder.com/400x300'],
    priceLevel: 0,
    description:
      'Bustling intersection known for bright lights, Broadway theaters, and entertainment.',
  },
  {
    id: '3',
    name: 'Brooklyn Bridge',
    address: 'Brooklyn Bridge, New York, NY 10038',
    lat: 40.706086,
    lon: -73.996864,
    category: 'landmark',
    rating: 4.7,
    reviews: 87000,
    phone: '',
    website: '',
    hours: 'Open 24 hours',
    photos: ['https://via.placeholder.com/400x300'],
    priceLevel: 0,
    description: 'Historic suspension bridge connecting Manhattan and Brooklyn.',
  },
  {
    id: '4',
    name: 'Statue of Liberty',
    address: 'New York, NY 10004',
    lat: 40.689247,
    lon: -74.044502,
    category: 'landmark',
    rating: 4.6,
    reviews: 156000,
    phone: '(212) 363-3200',
    website: 'www.nps.gov/stli',
    hours: '9:00 AM - 5:00 PM',
    photos: ['https://via.placeholder.com/400x300'],
    priceLevel: 2,
    description: 'Iconic monument symbolizing freedom and democracy.',
  },
  {
    id: '5',
    name: "Joe's Pizza",
    address: '7 Carmine St, New York, NY 10014',
    lat: 40.730824,
    lon: -74.002654,
    category: 'restaurant',
    rating: 4.3,
    reviews: 4200,
    phone: '(212) 366-1182',
    website: '',
    hours: '10:00 AM - 4:00 AM',
    photos: ['https://via.placeholder.com/400x300'],
    priceLevel: 1,
    description: 'Classic New York-style pizza served by the slice.',
  },
  {
    id: '6',
    name: 'Shell Gas Station',
    address: '156 11th Ave, New York, NY 10011',
    lat: 40.746536,
    lon: -74.007118,
    category: 'gas',
    rating: 3.9,
    reviews: 320,
    phone: '(212) 242-8868',
    website: '',
    hours: 'Open 24 hours',
    photos: ['https://via.placeholder.com/400x300'],
    priceLevel: 2,
    description: 'Gas station with convenience store.',
  },
  {
    id: '7',
    name: 'Icon Parking',
    address: '123 W 44th St, New York, NY 10036',
    lat: 40.757538,
    lon: -73.986486,
    category: 'parking',
    rating: 3.5,
    reviews: 180,
    phone: '(212) 575-8888',
    website: '',
    hours: 'Open 24 hours',
    photos: ['https://via.placeholder.com/400x300'],
    priceLevel: 3,
    description: 'Indoor parking garage in Midtown Manhattan.',
  },
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

// Map categories
export const MAP_CATEGORIES = [
  { id: 'restaurant', name: 'Restaurants', icon: 'utensils', color: '#ef4444' },
  { id: 'gas', name: 'Gas Stations', icon: 'fuel', color: '#f59e0b' },
  { id: 'parking', name: 'Parking', icon: 'parking-circle', color: '#3b82f6' },
  { id: 'hotel', name: 'Hotels', icon: 'bed', color: '#8b5cf6' },
  { id: 'atm', name: 'ATMs', icon: 'banknote', color: '#10b981' },
  { id: 'hospital', name: 'Hospitals', icon: 'cross', color: '#dc2626' },
  { id: 'park', name: 'Parks', icon: 'trees', color: '#059669' },
  { id: 'landmark', name: 'Landmarks', icon: 'landmark', color: '#0891b2' },
];

// Mock route data
export const MOCK_ROUTE = {
  distance: '3.2 mi',
  duration: '15 min',
  durationInTraffic: '22 min',
  steps: [
    {
      id: '1',
      instruction: 'Head north on 7th Ave toward W 44th St',
      distance: '0.3 mi',
      duration: '2 min',
      maneuver: 'straight',
    },
    {
      id: '2',
      instruction: 'Turn right onto W 57th St',
      distance: '0.5 mi',
      duration: '3 min',
      maneuver: 'turn-right',
    },
    {
      id: '3',
      instruction: 'Turn left onto 5th Ave',
      distance: '1.1 mi',
      duration: '6 min',
      maneuver: 'turn-left',
    },
    {
      id: '4',
      instruction: 'Turn right onto E 72nd St',
      distance: '0.8 mi',
      duration: '3 min',
      maneuver: 'turn-right',
    },
    {
      id: '5',
      instruction: 'Arrive at Central Park',
      distance: '0.5 mi',
      duration: '1 min',
      maneuver: 'arrive',
    },
  ],
};

// Saved places
export const MOCK_SAVED_PLACES = [
  { id: 's1', name: 'Home', address: '123 Main St, New York, NY', lat: 40.7489, lon: -73.968 },
  { id: 's2', name: 'Work', address: '456 Park Ave, New York, NY', lat: 40.7549, lon: -73.984 },
  { id: 's3', name: 'Gym', address: '789 Broadway, New York, NY', lat: 40.7282, lon: -73.9942 },
];

// Recent searches
export const MOCK_RECENT_SEARCHES = [
  'Central Park',
  'Times Square',
  'Coffee shops near me',
  'Best pizza in NYC',
];
