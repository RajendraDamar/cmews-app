# Forecast Tab - New UI Structure

## Main Page (forecast.tsx)
```
┌─────────────────────────────────────────────┐
│  Forecast Tab                               │
├─────────────────────────────────────────────┤
│  ┌─────┐ ┌─────┐ ┌──────────┐ ┌──────┐     │
│  │Cuaca│ │Angin│ │Gelombang │ │ Arus │     │
│  └─────┘ └─────┘ └──────────┘ └──────┘     │
├─────────────────────────────────────────────┤
│                                             │
│  [Active Tab Content - Scrollable]          │
│                                             │
└─────────────────────────────────────────────┘
```

## Weather Tab (Cuaca)
```
┌─────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════╗  │
│  ║ Senin                    [☀️] 32°/24° ║  │
│  ║ 10 Okt                   Cerah       ▼║  │
│  ╚═══════════════════════════════════════╝  │
│                                             │
│  [When expanded:]                           │
│  ┌───────────────────────────────────────┐  │
│  │ Grafik Suhu & Kelembapan              │  │
│  │ [Chart showing temp & humidity lines] │  │
│  ├───────────────────────────────────────┤  │
│  │ Prakiraan Per 3 Jam                   │  │
│  │ 00:00  [🌧️]  28°  💧 75%             │  │
│  │ 03:00  [☁️]  26°  💧 80%             │  │
│  │ 06:00  [☀️]  25°  💧 70%             │  │
│  │ ...                                   │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  [Next 6 days...]                           │
└─────────────────────────────────────────────┘
```

## Wind Tab (Angin)
```
┌─────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════╗  │
│  ║ Laut Jawa            [💨]  15-25 km/h ║  │
│  ║ Timur Laut            Sedang         ▼║  │
│  ╚═══════════════════════════════════════╝  │
│                                             │
│  [When expanded:]                           │
│  ┌───────────────────────────────────────┐  │
│  │ Kecepatan Angin (km/h)                │  │
│  │ [Line chart showing wind speed]       │  │
│  ├───────────────────────────────────────┤  │
│  │ Detail Per 3 Jam                      │  │
│  │ 00:00  Timur Laut      18 km/h       │  │
│  │ 03:00  Timur          20 km/h       │  │
│  │ ...                                   │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  [Next 9 sea areas...]                      │
└─────────────────────────────────────────────┘
```

## Wave Tab (Gelombang)
```
┌─────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════╗  │
│  ║ Selat Sunda          [🌊]  0.5-1.2 m ║  │
│  ║ Berombak              Periode 5s     ▼║  │
│  ╚═══════════════════════════════════════╝  │
│                                             │
│  [When expanded:]                           │
│  ┌───────────────────────────────────────┐  │
│  │ Tinggi Gelombang (m)                  │  │
│  │ [Area chart showing wave height]      │  │
│  ├───────────────────────────────────────┤  │
│  │ Detail Per 3 Jam                      │  │
│  │ 00:00             0.7 m              │  │
│  │ 03:00             0.9 m              │  │
│  │ ...                                   │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  [Next 9 sea areas...]                      │
└─────────────────────────────────────────────┘
```

## Current Tab (Arus)
```
┌─────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════╗  │
│  ║ Laut Banda           [↔️]  0.45 m/s  ║  │
│  ║ Barat Daya                           ▼║  │
│  ╚═══════════════════════════════════════╝  │
│                                             │
│  [When expanded:]                           │
│  ┌───────────────────────────────────────┐  │
│  │ Kecepatan Arus (m/s)                  │  │
│  │ [Line chart showing current speed]    │  │
│  ├───────────────────────────────────────┤  │
│  │ Detail Per 3 Jam                      │  │
│  │ 00:00  Barat Daya     0.42 m/s       │  │
│  │ 03:00  Barat         0.48 m/s       │  │
│  │ ...                                   │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  [Next 9 sea areas...]                      │
└─────────────────────────────────────────────┘
```

## Key Features Implemented

### Components
1. **ExpandableDayCard** - Weather forecast cards with collapsible content
2. **WindCard** - Wind data with Beaufort scale
3. **WaveCard** - Wave height with color-coded severity
4. **CurrentCard** - Ocean current data
5. **WeatherChart** - Temperature & humidity visualization
6. **HourlyBreakdown** - 3-hour interval details
7. **WeatherIcon** - Icons with colored backgrounds

### Data Structure
- 7 days of weather forecast
- 10 Indonesian sea areas (Laut Jawa, Selat Sunda, etc.)
- 8 hourly entries per day (3-hour intervals: 00:00, 03:00, ..., 21:00)
- Mock data with realistic values

### Charts (Victory Native v41)
- Temperature line chart (orange)
- Humidity area chart (blue with opacity)
- Wind speed line chart (teal)
- Wave height area chart (blue gradient)
- Current speed line chart (indigo)

### Color Coding
**Weather Icons:**
- Cerah → Sun with yellow-500 background
- Hujan Lebat → CloudRainWind with blue-700 background
- Berawan → Cloud with gray-400 background

**Wave Severity:**
- Green: < 0.5m (Tenang)
- Yellow: 0.5-1.25m (Berombak)
- Orange: 1.25-2.5m (Sedang)
- Red: > 2.5m (Kasar)

**Wind (Beaufort Scale):**
- Green/Blue: 0-3 (Tenang/Berombak Ringan)
- Yellow: 4-6 (Sedang/Agak Kasar)
- Orange/Red: 7+ (Kasar/Badai)
