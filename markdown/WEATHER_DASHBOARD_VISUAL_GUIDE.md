# Weather Dashboard Visual Guide

## Component Hierarchy

```
Home Screen (app/(tabs)/index.tsx)
│
├── LocationSelector
│   ├── MapPin icon
│   ├── Location text (Kecamatan, Kota, Provinsi)
│   └── RefreshCw button
│
├── [Mobile Layout] Stack Vertically
│   │
│   ├── HeroCard
│   │   ├── Temperature (48px bold)
│   │   ├── Weather description
│   │   ├── Location (kecamatan, kota, provinsi)
│   │   ├── WeatherIcon (80px, colored background)
│   │   └── Last updated timestamp
│   │
│   ├── QuickStats
│   │   ├── Horizontal ScrollView
│   │   ├── Humidity Card (with progress bar)
│   │   ├── Wind Speed Card
│   │   └── Feels Like Card
│   │
│   ├── HourlyForecastCard
│   │   ├── Card Header ("Prakiraan Per Jam")
│   │   └── Horizontal ScrollView (8 items)
│   │       ├── Time (HH:mm)
│   │       ├── WeatherIcon (40px)
│   │       └── Temperature
│   │
│   ├── DetailedMetrics
│   │   ├── Temperature Accordion
│   │   │   ├── Current / Feels Like
│   │   │   └── Min / Max
│   │   ├── Wind Accordion
│   │   │   ├── Speed / Direction
│   │   │   └── Gust
│   │   └── Atmospheric Accordion
│   │       ├── Pressure / Humidity
│   │       └── Visibility
│   │
│   └── DailyForecast
│       └── 7-day forecast cards
│
└── [Desktop Layout] 2-Column Grid
    ├── Left Column (40%)
    │   └── HeroCard
    │
    └── Right Column (60%)
        └── QuickStats
        
    (Rest stacked below)
```

## Weather Icon Mapping

```
Weather Condition    Icon              Color         Background
─────────────────────────────────────────────────────────────────
Cerah               Sun              yellow-500     yellow-100
Cerah Berawan       CloudSun         orange-400     orange-100
Berawan             Cloud            gray-400       gray-100
Hujan Ringan        CloudDrizzle     blue-400       blue-100
Hujan Sedang        CloudRain        blue-500       blue-100
Hujan Lebat         CloudRainWind    blue-700       blue-200
Hujan Petir         CloudLightning   purple-500     purple-100
Petir               CloudLightning   purple-500     purple-100
Kabut               CloudFog         gray-300       gray-100
```

## Color Palette

### Hero Card
- **Light Mode**: Gradient from blue-500 to blue-700
- **Dark Mode**: Solid blue-900
- **Text**: White with opacity variations (100%, 90%, 70%, 60%)

### Quick Stats
- **Icon Color**: 
  - Light: blue-500 (#3b82f6)
  - Dark: blue-400 (#60a5fa)
- **Progress Bar**:
  - Track: bg-secondary
  - Fill: bg-primary

### Detailed Metrics
- **Accordion Header**: bg-muted
- **Accordion Content**: bg-card
- **Chevron Icon**: Same as Quick Stats icon color

## Loading States

### Hero Card Skeleton
```
┌─────────────────────────────────────┐
│ Gradient Background (blue-500)      │
│                                     │
│  [████████] 16h skeleton            │
│  [██████] 6h skeleton       [████] │
│  [████] 4h skeleton          80x80 │
│                             circle │
└─────────────────────────────────────┘
```

### Quick Stats Skeleton
```
┌────────┐  ┌────────┐  ┌────────┐
│ [████] │  │ [████] │  │ [████] │
│        │  │        │  │        │
│ 140px  │  │ 140px  │  │ 140px  │
└────────┘  └────────┘  └────────┘
```

### Hourly Forecast Skeleton
```
┌──────────────────────────────────────┐
│ [██████] Header skeleton             │
│                                      │
│ [████████████] Large skeleton        │
└──────────────────────────────────────┘
```

## Responsive Breakpoints

```
Mobile      < 768px    Stack all components vertically
Tablet      768-1023   Stack all components vertically
Desktop     >= 1024px  2-column grid for Hero + QuickStats
```

## Data Flow

```
MOCK_BMKG_WEATHER (lib/data/weather-mock.ts)
    │
    ├── location → LocationSelector
    │                    
    ├── currentWeather → HeroCard
    │   ├── temperature
    │   ├── weather.description → WeatherIcon
    │   └── lastUpdated
    │
    ├── currentWeather → QuickStats
    │   ├── humidity
    │   ├── windSpeed
    │   └── feelsLike
    │
    ├── hourlyForecast → HourlyForecastCard
    │   ├── datetime → formatTime24
    │   ├── weather.description → WeatherIcon
    │   └── temperature
    │
    ├── currentWeather + dailyForecast → DetailedMetrics
    │   ├── temperature (current + daily min/max)
    │   ├── wind (speed, direction, gust)
    │   └── atmospheric (pressure, humidity, visibility)
    │
    └── dailyForecast → DailyForecast
        └── 7-day forecast data
```

## Component Props

### HeroCard
```typescript
{
  temperature: number;
  weather: string;
  location: {
    kecamatan: string;
    kota: string;
    provinsi: string;
  };
  lastUpdate: string;
}
```

### QuickStats
```typescript
{
  humidity: number;      // 0-100
  windSpeed: number;     // km/h
  feelsLike: number;     // °C
}
```

### WeatherIcon
```typescript
{
  condition: string;     // BMKG weather description
  size?: number;         // default: 48
}
```

### HourlyForecastCard
```typescript
{
  hourlyData: {
    time: string;        // BMKG datetime format
    weather: string;     // Weather condition
    temp: number;        // °C
  }[];
}
```

### DetailedMetrics
```typescript
{
  temperature: {
    current: number;
    feelsLike: number;
    min: number;
    max: number;
  };
  wind: {
    speed: number;
    direction: string;
    gust?: number;
  };
  atmospheric: {
    pressure: number;
    humidity: number;
    visibility: number;
  };
}
```

## Animation & Interactions

1. **Pull to Refresh**: Native RefreshControl with theme colors
2. **Accordion Toggle**: Smooth expand/collapse with ChevronDown/Up rotation
3. **Skeleton Loading**: Fade-in animation (1.5s delay)
4. **Horizontal Scroll**: Smooth native scrolling for stats and hourly forecast

## Accessibility

- All Pressable components have proper `accessibilityLabel`
- Theme colors meet WCAG contrast requirements
- Icon sizes are readable (minimum 20px)
- Touch targets meet minimum 44x44 requirement
