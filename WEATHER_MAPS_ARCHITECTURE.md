# Weather Observation Platform - Component Architecture

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Maps Screen (Root)                    │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Responsive Layout Handler              │ │
│  │  - Mobile (< 768px): Full map + overlays           │ │
│  │  - Desktop (>= 1024px): Sidebar + map split        │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
        ┌───────▼────────┐      ┌──────▼──────┐
        │  Mobile Layout  │      │Desktop Layout│
        └────────────────┘      └──────────────┘
```

## 📱 Mobile Layout Structure

```
┌─────────────────────────────────────┐
│        🔍 Search Bar (Floating)     │
│        ┌─────────────────────┐     │
│        │  Cari lokasi...     │     │
│        └─────────────────────┘     │
├─────────────────────────────────────┤
│                                     │
│     🗺️  MapLibre Map View          │
│                                     │
│     ┌──┐ Weather Report Markers    │
│     │🟢│ Low Severity               │
│     └──┘                            │
│     ┌──┐                            │
│     │🟡│ Medium Severity            │  🌤️ Weather Layer
│     └──┘                            │  Toggle (Top-Right)
│     ┌──┐                            │
│     │🔴│ High Severity              │  ┌─────────┐
│     └──┘                            │  │   📍    │ Location
│                                     │  │   +     │ Zoom In
│                                     │  │   -     │ Zoom Out
│                                     │  └─────────┘
│                                     │  (Right Side)
│                                     │
│                      ┌─────────┐    │
│                      │    ➕   │    │ FAB
│                      └─────────┘    │ (Bottom-Right)
└─────────────────────────────────────┘

        ⬇️ (When report selected)

┌─────────────────────────────────────┐
│   📋 Report Bottom Sheet (80vh)     │
│ ┌─────────────────────────────────┐ │
│ │  — (Swipe handle)               │ │
│ │                                 │ │
│ │  📍 Monas, Jakarta Pusat   🔴   │ │
│ │  ─────────────────────────────  │ │
│ │  👤 BS  Budi Santoso            │ │
│ │        10 Oktober, 10:30        │ │
│ │  ─────────────────────────────  │ │
│ │  ┌──────────┐  ┌──────────┐    │ │
│ │  │ 🌡️ 26°C │  │ 💧 85%   │    │ │
│ │  └──────────┘  └──────────┘    │ │
│ │  ┌──────────┐  ┌──────────┐    │ │
│ │  │ 🌬️ 25 km/h│ │ 🌧️ Hujan │   │ │
│ │  └──────────┘  └──────────┘    │ │
│ │  ─────────────────────────────  │ │
│ │  📝 Notes: Hujan lebat...       │ │
│ │  📷 [Photo if available]        │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## 🖥️ Desktop Layout Structure

```
┌────────────────────────────────────────────────────────────┐
│                  Desktop Split Layout                       │
│  ┌─────────────────┐  ┌──────────────────────────────────┐ │
│  │   Sidebar 30%   │  │        Map Area 70%              │ │
│  │                 │  │                                  │ │
│  │ 🔍 Search       │  │   🗺️  MapLibre Map              │ │
│  │ ┌─────────────┐ │  │                                  │ │
│  │ │ Cari...     │ │  │   Weather Report Markers         │ │
│  │ └─────────────┘ │  │                                  │ │
│  │                 │  │   🌤️ Weather Layer Toggle        │ │
│  │ 🎛️ Filters      │  │   (Top-Right)                    │ │
│  │ ☑️ Semua        │  │                                  │ │
│  │ ☑️ 🟢 Rendah    │  │                        ┌───────┐ │ │
│  │ ☑️ 🟡 Sedang    │  │                        │  📍   │ │ │
│  │ ☑️ 🔴 Tinggi    │  │                        │   +   │ │ │
│  │                 │  │                        │   -   │ │ │
│  │ ────────────── │  │                        └───────┘ │ │
│  │                 │  │                        (Controls)│ │
│  │ 📋 Selected     │  │                                  │ │
│  │    Report       │  │                     ┌──────────┐ │ │
│  │ or              │  │                     │    ➕    │ │ │
│  │ 📋 Recent       │  │                     └──────────┘ │ │
│  │    Reports      │  │                     FAB          │ │
│  │    List         │  │                     (Bottom-Right)│ │
│  │                 │  │                                  │ │
│  └─────────────────┘  └──────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

## 🔄 Component Interactions

### Report Submission Flow
```
1. User clicks FAB (+)
   ↓
2. ReportFormDialog opens
   ↓
3. User fills:
   - Weather condition (Select)
   - Severity (Select)
   - Temperature (Input)
   - Wind speed (Input)
   - Notes (Textarea)
   ↓
4. User clicks "Kirim Laporan"
   ↓
5. New report added to state
   ↓
6. Map updates with new marker
   ↓
7. Dialog closes
```

### Report Selection Flow
```
1. User clicks marker on map
   ↓
2. SeverityMarker onPress triggered
   ↓
3. selectedReport state updated
   ↓
4. Camera flies to location
   ↓
Mobile:                      Desktop:
ReportBottomSheet opens      Sidebar shows report card
↓                            ↓
User can swipe to close      User can select another
```

### Filter Flow
```
1. User toggles filter checkbox
   ↓
2. filters state updated
   ↓
3. filteredReports recomputed
   ↓
4. Map re-renders markers
   ↓
5. Sidebar updates report list
```

## 🎨 Severity Marker Design

```
Low Severity (Green)          Medium Severity (Orange)       High Severity (Red)
┌────────────┐               ┌────────────┐                ┌────────────┐
│  ┌──────┐  │               │  ┌──────┐  │                │  ┌──────┐  │
│  │      │  │               │  │      │  │                │  │      │  │
│  │  ☀️  │  │ #10B981       │  │  ☁️  │  │ #F59E0B        │  │  🌧️  │  │ #EF4444
│  │      │  │               │  │      │  │                │  │      │  │
│  └──────┘  │               └──────────┘                  └──────────┘
│   3px ring │               │   3px ring │                │   3px ring │
└────────────┘               └────────────┘                └────────────┘
  40x40px                      40x40px                       40x40px
  Selected: 44x44px            Selected: 44x44px             Selected: 44x44px
```

## 📊 Data Flow

```
┌──────────────────────────────────────────────────────┐
│              mockWeatherReports (25 items)           │
│  - Jakarta locations                                 │
│  - Mixed severity levels                             │
│  - Various weather conditions                        │
└──────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│              MapsScreen State                        │
│  - reports: WeatherReport[]                          │
│  - selectedReport: WeatherReport | null              │
│  - filters: WeatherReportFilters                     │
│  - showReportForm: boolean                           │
│  - showWeatherLayer: boolean                         │
└──────────────────────────────────────────────────────┘
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
   ┌─────────────────┐     ┌─────────────────┐
   │ filteredReports │     │  User Actions   │
   │ (computed)      │     │  - Filter       │
   │                 │     │  - Select       │
   │ Applied filters │     │  - Submit       │
   │ to reports list │     │  - Search       │
   └─────────────────┘     └─────────────────┘
            │
            ▼
   ┌─────────────────────────────────┐
   │  Rendered on Map & Sidebar      │
   │  - SeverityMarker components    │
   │  - RecentReportsList            │
   │  - DesktopSidebar display       │
   └─────────────────────────────────┘
```

## 🔑 Key Components Summary

| Component | Purpose | Platform |
|-----------|---------|----------|
| **SeverityMarker** | Color-coded map marker | Both |
| **ReportBottomSheet** | Report details view | Mobile |
| **ReportFormDialog** | New report form | Both |
| **DesktopSidebar** | Filters & report list | Desktop |
| **RecentReportsList** | Scrollable report cards | Desktop |
| **WeatherLayerToggle** | Toggle weather overlay | Both |
| **SearchBar** | Location search | Both |

## 🎯 Map Controls

```
Right Side Controls (Vertical Stack):
┌─────────┐
│    +    │  Zoom In
├─────────┤
│    -    │  Zoom Out
├─────────┤
│   📍    │  My Location
└─────────┘
```

## 🌐 Indonesian Language Elements

- **Weather Conditions**: Cerah, Berawan, Hujan Ringan/Sedang/Lebat, Kabut
- **Severity Levels**: Rendah (🟢), Sedang (🟡), Tinggi (🔴)
- **Form Labels**: Lokasi, Kondisi Cuaca, Tingkat Keparahan, Suhu, Kecepatan Angin, Catatan
- **Buttons**: Kirim Laporan, Batal, Unggah Foto
- **Data Labels**: Kelembaban, Arah Angin
- **Filters**: Semua Laporan, Laporan Terbaru
