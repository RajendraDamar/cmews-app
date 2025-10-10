# Forecast Tab Visual Structure

## Tab Navigation
```
┌─────────────────────────────────────────────────┐
│  Forecast Tab                                    │
├─────────────────────────────────────────────────┤
│  [ Cuaca ]  [ Angin ]  [ Gelombang ]  [ Arus Laut ] │
└─────────────────────────────────────────────────┘
```

## Tab 1: WEATHER (Cuaca) ☀️

### Timeframe Selector
```
┌─────────────────────────────────────┐
│  [●●●●] 24 Jam   [ ] 3 Hari   [ ] 7 Hari  │
└─────────────────────────────────────┘
```

### Temperature Overview Card
```
┌──────────────────────────────────────┐
│  Tren Suhu                           │
│  ┌────────────────────────────────┐ │
│  │  ☀  Suhu Rata-rata   Rentang   │ │
│  │     26°C             22° - 30°  │ │
│  └────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### Forecast Cards (Scrollable List)
```
┌──────────────────────────────────────┐
│  Prakiraan 24 Jam                    │
│                                      │
│  ┌────────────────────────────────┐ │
│  │  10 Okt     ☁️                  │ │
│  │  09:00      27°                 │ │
│  │  Cerah Berawan                  │ │
│  │             💧 65%  🌧 20%  ☀ 5  │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │  10 Okt     ☁️                  │ │
│  │  12:00      28°                 │ │
│  │  Berawan                        │ │
│  │             💧 70%  🌧 15%  ☀ 6  │ │
│  └────────────────────────────────┘ │
│                                      │
│  ... (6 more cards)                 │
└──────────────────────────────────────┘
```

## Tab 2: WIND (Angin) 💨

### Wind Overview
```
┌──────────────────────────────────────┐
│  ┌────────────────────────────────┐ │
│  │  💨  Kecepatan Angin Rata-rata │ │
│  │      18 km/h           🧭      │ │
│  └────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### Sea Areas (Horizontal Scroll)
```
┌──────────────────────────────────────────────────────────┐
│  Area Laut                                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│  │ Laut    │  │ Selat   │  │ Laut    │  │ Selat   │ → │
│  │ Jawa    │  │ Sunda   │  │ Natuna  │  │ Karimata│   │
│  │         │  │         │  │         │  │         │   │
│  │ 12-20   │  │ 15-25   │  │ 18-28   │  │ 10-18   │   │
│  │ km/h    │  │ km/h    │  │ km/h    │  │ km/h    │   │
│  │         │  │         │  │         │  │         │   │
│  │ Timur   │  │ Barat   │  │ Timur   │  │ Utara   │   │
│  │ Laut    │  │ Daya    │  │ Laut    │  │         │   │
│  │ [Sedang]│  │ [Kasar] │  │ [Sedang]│  │ [Tenang]│   │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘   │
└──────────────────────────────────────────────────────────┘
```

### Wind Details (List)
```
┌──────────────────────────────────────┐
│  Detail Angin per Area               │
│                                      │
│  ┌────────────────────────────────┐ │
│  │  Laut Jawa          [Sedang]   │ │
│  │                                │ │
│  │  Kecepatan:        12-20 km/h  │ │
│  │  Arah:             Timur Laut  │ │
│  │  Hembusan Kencang: 25 km/h     │ │
│  │  Skala Beaufort:   4           │ │
│  └────────────────────────────────┘ │
│                                      │
│  ... (9 more areas)                 │
└──────────────────────────────────────┘
```

## Tab 3: WAVE (Gelombang) 🌊

### Wave Overview
```
┌──────────────────────────────────────┐
│  ┌────────────────────────────────┐ │
│  │  🌊  Tinggi Gelombang          │ │
│  │      Rata-rata: 1.8 m   ⚠️ 2   │ │
│  │                    area        │ │
│  │                    berbahaya   │ │
│  └────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### Wave Categories Legend
```
┌──────────────────────────────────────────────────────┐
│  Kategori Gelombang                                  │
│  [0-0.5m: Tenang] [0.5-1.25m: Berombak]             │
│  [1.25-2.5m: Sedang] [2.5-4m: Kasar]                │
│  [4m+: Sangat Kasar]                                │
└──────────────────────────────────────────────────────┘
```

### Sea Areas (Horizontal Scroll)
```
┌──────────────────────────────────────────────────────┐
│  Area Laut                                           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌────────┐│
│  │ Laut    │  │ Selat   │  │ Laut    │  │ Selat  ││
│  │ Jawa    │  │ Sunda   │  │ Natuna  │  │ Karima.││
│  │         │  │         │  │         │  │        ││
│  │ 1.2-2.0 │  │ 2.0-3.5 │  │ 0.8-1.5 │  │ 1.0-1.8││
│  │ m       │  │ m  ⚠️    │  │ m       │  │ m      ││
│  │         │  │         │  │         │  │        ││
│  │ Sign:   │  │ Sign:   │  │ Sign:   │  │ Sign:  ││
│  │ 1.6 m   │  │ 2.8 m   │  │ 1.2 m   │  │ 1.4 m  ││
│  │[Sedang] │  │ [Kasar] │  │[Beromb.]│  │[Sedang]││
│  └─────────┘  └─────────┘  └─────────┘  └────────┘│
└──────────────────────────────────────────────────────┘
```

### Wave Details (List)
```
┌──────────────────────────────────────┐
│  Detail Gelombang per Area           │
│                                      │
│  ┌────────────────────────────────┐ │
│  │  Laut Jawa    ⚠️    [Sedang]   │ │
│  │                                │ │
│  │  Tinggi Minimum:    1.2 m 🟡   │ │
│  │  Tinggi Maksimum:   2.0 m 🟡   │ │
│  │  Tinggi Signifikan: 1.6 m 🟡   │ │
│  │  Periode:           6 detik    │ │
│  │  Arah:              Barat Daya │ │
│  └────────────────────────────────┘ │
│                                      │
│  ... (9 more areas)                 │
└──────────────────────────────────────┘
```

## Tab 4: CURRENT (Arus Laut) 🌀

### Current Overview
```
┌──────────────────────────────────────┐
│  ┌────────────────────────────────┐ │
│  │  🌀  Kecepatan Arus            │ │
│  │      Rata-rata: 0.45 m/s  ⚠️ 3 │ │
│  │      (0.9 knot)        arus    │ │
│  │                        kuat    │ │
│  └────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### Current Categories Legend
```
┌──────────────────────────────────────────────────────┐
│  Kategori Arus                                       │
│  [0-0.25 m/s: Lemah] [0.25-0.5 m/s: Sedang]         │
│  [0.5-1 m/s: Kuat] [1+ m/s: Sangat Kuat]            │
└──────────────────────────────────────────────────────┘
```

### Sea Areas (Horizontal Scroll)
```
┌──────────────────────────────────────────────────────┐
│  Area Laut                                           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌────────┐│
│  │ Laut    │  │ Selat   │  │ Laut    │  │ Selat  ││
│  │ Jawa    │  │ Sunda   │  │ Natuna  │  │ Karima.││
│  │         │  │         │  │         │  │        ││
│  │ 0.35 m/s│  │ 0.68 m/s│  │ 0.22 m/s│  │ 0.41   ││
│  │         │  │    ⚠️    │  │         │  │ m/s    ││
│  │         │  │         │  │         │  │        ││
│  │ Timur   │  │ Barat   │  │ Selatan │  │ Utara  ││
│  │ (90°)   │  │ (270°)  │  │ (180°)  │  │ (0°)   ││
│  │ [Sedang]│  │ [Kuat]  │  │ [Lemah] │  │[Sedang]││
│  └─────────┘  └─────────┘  └─────────┘  └────────┘│
└──────────────────────────────────────────────────────┘
```

### Current Details (List)
```
┌──────────────────────────────────────┐
│  Detail Arus per Area                │
│                                      │
│  ┌────────────────────────────────┐ │
│  │  Laut Jawa         [Sedang]    │ │
│  │                                │ │
│  │  Kecepatan (m/s):  0.35 m/s 🔵 │ │
│  │  Kecepatan (knot): 0.7 knot 🔵 │ │
│  │  Arah:    🧭→ Timur (90°)      │ │
│  └────────────────────────────────┘ │
│                                      │
│  ... (9 more areas)                 │
└──────────────────────────────────────┘
```

## Color Legend

### Sea State Colors
- 🟢 Green: Tenang (Calm) - 0-0.5m
- 🔵 Blue: Berombak (Slight) - 0.5-1.25m  
- 🟡 Yellow: Sedang (Moderate) - 1.25-2.5m
- 🟠 Orange: Kasar (Rough) - 2.5-4m
- 🔴 Red: Sangat Kasar (Very Rough) - 4m+

### Current Strength Colors
- 🟢 Green: Lemah (Weak) - 0-0.25 m/s
- 🔵 Blue: Sedang (Moderate) - 0.25-0.5 m/s
- 🟠 Orange: Kuat (Strong) - 0.5-1 m/s
- 🔴 Red: Sangat Kuat (Very Strong) - 1+ m/s

### Wind Speed Colors
- 🟢 Green: < 15 km/h
- 🔵 Blue: 15-25 km/h
- 🟡 Yellow: 25-40 km/h
- 🟠 Orange: 40-60 km/h
- 🔴 Red: > 60 km/h

## Icons Used
- ☀️ Sun: Temperature, UV Index, Clear weather
- ☁️ Cloud: Cloudy conditions
- 🌧️ CloudRain: Precipitation
- 💧 Droplets: Humidity
- 💨 Wind: Wind speed/direction
- 🌊 Waves: Wave height
- 🌀 Spiral: Ocean currents
- 🧭 Navigation: Direction indicator
- ⚠️ AlertTriangle: Danger warnings
