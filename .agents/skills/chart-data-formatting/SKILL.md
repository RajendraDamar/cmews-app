---
name: chart-data-formatting
description: Chart data formatting and rendering guide for cmews-app — covers React Native Chart Kit, Skia charts with SmartChartWrapper, data validation, and weather data visualization patterns.
---

# Chart Data Formatting Skill

Reference for implementing and validating charts in cmews-app. During prototyping, chart data is supplied by the dynamic mock engine.

## Chart Rendering Stack

| Library | Platform | Primary Use Case |
|:---|:---|:---|
| `@shopify/react-native-skia` | Native (iOS / Android) | High-performance GPU rendering |
| `react-native-chart-kit` | Cross-platform / Web | Compatibility & Web fallback |
| `SmartChartWrapper` | All | Automatic runtime selection between Skia and ChartKit |

## Invariant Chart Rules

1. **Validation Bounds**: Always filter/sanitize data before passing to chart components:
   - Temperature range: `15°C <= temp <= 40°C`
   - Humidity range: `30% <= humidity <= 100%`
   - Maximum 24 data points per chart (3 days × 8 forecasts).
2. **Color Palettes**:
   - Temperature: Warm gradient `rgba(255, 107, 53, opacity)` (`#ff6b35`).
   - Precipitation / Humidity: Cool blue `rgba(59, 130, 246, opacity)` (`#3b82f6`).
3. **Locale & Formatting**: Time labels must format as `HH:mm` using `id-ID` locale.

## References & Examples

- Complete component example: [ChartKitTemperatureChart.tsx](./examples/ChartKitTemperatureChart.tsx).
