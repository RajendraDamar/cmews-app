---
name: chart-data-formatting
description: Chart data formatting and rendering guide for cmews-app — covers React Native Chart Kit, Skia charts with SmartChartWrapper, data validation, and BMKG weather data visualization patterns.
---

# Chart Data Formatting Skill

This skill provides the complete reference for implementing charts in cmews-app using real BMKG weather data. Use when creating, modifying, or debugging any chart component.

## Chart Stack

| Library | Use Case | Platform |
|:---|:---|:---|
| React Native Chart Kit | Cross-platform line/bar charts | iOS, Android, Web |
| @shopify/react-native-skia | High-performance rendering | iOS, Android |
| SmartChartWrapper | Automatic selection between ChartKit and Skia | All |

## Temperature Chart — Real BMKG Data

```typescript
// components/charts/ChartKitTemperatureChart.tsx
export const ChartKitTemperatureChart = ({ wilayahCode }: { wilayahCode: string }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const loadRealData = async () => {
      try {
        const bmkgService = new BMKGService();
        const weatherData = await bmkgService.getWeatherForecast(wilayahCode);
        const processed = processBMKGForecast(weatherData);

        // Take first 24 hours (8 forecasts) for temperature chart
        const next24Hours = processed.dailyForecasts[0] || [];

        const chartData = {
          labels: next24Hours.map(item =>
            new Date(item.datetime).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit'
            })
          ),
          datasets: [{
            data: next24Hours.map(item => item.temperature),
            color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`
          }]
        };

        setChartData(chartData);
      } catch (error) {
        console.error('Failed to load real weather data:', error);
      }
    };

    loadRealData();
  }, [wilayahCode]);

  if (!chartData) return <LoadingChartSkeleton />;

  return (
    <LineChart
      data={chartData}
      width={screenWidth - 32}
      height={200}
      chartConfig={getChartConfig()}
      bezier
    />
  );
};
```

## Chart Data Rules

1. **Always validate data** before passing to chart components
2. **Maximum 24 data points** for charts (3 days × 8 forecasts)
3. **Handle empty/invalid data** gracefully with skeleton or error states
4. **Use SmartChartWrapper** for automatic Skia/ChartKit selection based on platform capabilities
5. **Temperature colors**: Use warm gradient `rgba(255, 107, 53, opacity)`
6. **Time labels**: Format as `HH:mm` using `id-ID` locale

## Data Validation Before Rendering

```typescript
const validateChartData = (data: any[]) => {
  return data
    .filter(item => item.temperature >= 15 && item.temperature <= 40)
    .filter(item => item.humidity >= 30 && item.humidity <= 100)
    .slice(0, 24);
};
```

## SmartChartWrapper Usage

SmartChartWrapper automatically selects the best rendering engine:
- **Native (iOS/Android)**: Prefers Skia for GPU-accelerated rendering
- **Web**: Falls back to ChartKit for compatibility
- Always pass data through validation before SmartChartWrapper
