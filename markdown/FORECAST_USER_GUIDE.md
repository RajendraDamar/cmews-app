# Quick Start Guide: Forecast Tab

## Overview
The Forecast tab now has **4 sub-tabs** instead of the previous 3-day forecast:

1. **Cuaca (Weather)** ☀️ - Temperature, humidity, precipitation, UV index
2. **Angin (Wind)** 💨 - Wind speed, direction, Beaufort scale
3. **Gelombang (Wave)** 🌊 - Wave height, period, sea state
4. **Arus Laut (Current)** 🌀 - Current speed, direction, strength

## Navigation
```
Home Tab → Forecast Tab → [Cuaca | Angin | Gelombang | Arus Laut]
```

## What You'll See in Each Tab

### 1. Weather Tab (Cuaca)

**Top Section:**
- Timeframe selector with 3 options: `24 Jam`, `3 Hari`, `7 Hari`
- Temperature overview card showing average temp and range

**Main Content:**
- List of forecast cards (8-14 items depending on timeframe)
- Each card shows:
  - Date and time in Indonesian format
  - Temperature with weather icon
  - Weather condition (e.g., "Cerah Berawan", "Hujan Ringan")
  - Humidity percentage with droplet icon
  - Precipitation probability with rain icon
  - UV Index (only shown during daytime)

**Example Data:**
- 24H mode: 8 cards at 3-hour intervals
- 3D mode: 12 cards at 6-hour intervals
- 7D mode: 14 cards at 12-hour intervals

### 2. Wind Tab (Angin)

**Top Section:**
- Overview card showing average wind speed across all areas
- Displays navigation compass icon

**Sea Area Cards (Horizontal Scroll):**
- 10 cards, one for each Indonesian sea area
- Each card shows:
  - Sea area name (e.g., "Laut Jawa", "Selat Sunda")
  - Wind speed range (min-max in km/h)
  - Wind direction (e.g., "Timur Laut") with degrees
  - Beaufort scale description badge (color-coded)

**Detailed List:**
- Full details for all 10 sea areas
- Shows: Speed range, Direction, Gust speed, Beaufort scale number
- Color-coded badges:
  - Green/Blue: Light winds (0-3 Beaufort)
  - Yellow: Moderate winds (4-6 Beaufort)
  - Orange/Red: Strong winds (7+ Beaufort)

### 3. Wave Tab (Gelombang)

**Top Section:**
- Overview showing average significant wave height
- Alert count for dangerous areas (waves >2.5m)

**Category Legend:**
- Visual guide showing wave height categories:
  - 0-0.5m: Tenang (Green)
  - 0.5-1.25m: Berombak (Blue)
  - 1.25-2.5m: Sedang (Yellow)
  - 2.5-4m: Kasar (Orange)
  - 4m+: Sangat Kasar (Red)

**Sea Area Cards (Horizontal Scroll):**
- 10 cards showing:
  - Wave height range
  - Significant wave height
  - Sea state badge (color-coded)
  - Warning icon for dangerous waves

**Detailed List:**
- All 10 areas with:
  - Min/Max/Significant heights (color-coded by intensity)
  - Wave period in seconds
  - Wave direction
  - Alert icon for dangerous conditions

### 4. Current Tab (Arus Laut)

**Top Section:**
- Overview showing average current speed
- Speed shown in both m/s and knots
- Alert count for strong current areas (>0.5 m/s)

**Category Legend:**
- Current strength categories:
  - 0-0.25 m/s: Lemah (Green)
  - 0.25-0.5 m/s: Sedang (Blue)
  - 0.5-1 m/s: Kuat (Orange)
  - 1+ m/s: Sangat Kuat (Red)

**Sea Area Cards (Horizontal Scroll):**
- 10 cards showing:
  - Current speed in m/s
  - Direction with degrees
  - Strength badge (color-coded)

**Detailed List:**
- All 10 areas with:
  - Speed in m/s
  - Speed in knots (converted)
  - Direction with rotating navigation icon
  - Alert icon for strong currents

## Sea Areas Covered

The app provides data for these 10 Indonesian maritime areas:

1. **Laut Jawa** (Java Sea)
2. **Selat Sunda** (Sunda Strait)
3. **Laut Natuna** (Natuna Sea)
4. **Selat Karimata** (Karimata Strait)
5. **Laut Banda** (Banda Sea)
6. **Selat Makassar** (Makassar Strait)
7. **Laut Flores** (Flores Sea)
8. **Teluk Bone** (Bone Bay)
9. **Laut Sawu** (Sawu Sea)
10. **Laut Arafura** (Arafura Sea)

## Alert System

The app automatically highlights dangerous conditions:

**Wave Alerts:** ⚠️
- Triggered when significant wave height ≥ 2.5 meters
- Shows warning triangle icon
- Badge turns orange/red

**Current Alerts:** ⚠️
- Triggered when current speed ≥ 0.5 m/s
- Shows warning triangle icon
- Badge turns orange/red

**Wind Alerts:**
- Color-coded badges show wind intensity
- Red badges for Beaufort scale ≥ 7 (Strong winds)

## Theme Support

All tabs support both light and dark modes:
- Icons automatically adjust colors
- Text maintains proper contrast
- Cards adapt background colors
- Badges remain visible in both themes

## Interactions

**Timeframe Selector (Weather Tab Only):**
- Tap any of the three buttons to switch timeframes
- Selected button shows blue background
- Data updates immediately

**Horizontal Scroll (All Tabs):**
- Swipe left/right on sea area cards
- Shows 1-2 cards at a time on mobile
- Smooth scroll animation

**Tab Switching:**
- Tap any of the 4 tab names at the top
- Smooth transition between tabs
- Each tab maintains its own scroll position

## Data Updates

Currently using **mock data** that simulates realistic conditions:
- Weather data varies by time of day (higher temps during daytime)
- Wind speeds range from 10-40 km/h
- Wave heights range from 0.5-4 meters
- Current speeds range from 0.1-1.5 m/s
- All directions randomized across 8 cardinal points

**Future Enhancement:** Connect to real BMKG API for live data.

## Tips for Users

1. **Check Weather Tab first** - Get overall forecast and timeframe
2. **Check Wave Tab for dangerous conditions** - Look for red badges
3. **Use horizontal scroll** - Quickly compare different sea areas
4. **Watch for alert icons** - Triangle warnings indicate danger
5. **Color-coded badges** - Green is safe, red is dangerous

## Technical Notes

- All text in Indonesian (Bahasa Indonesia)
- Uses React Native Reusables UI components
- Fully responsive design
- TypeScript for type safety
- Dark mode optimized
- No external API calls (uses mock data)
