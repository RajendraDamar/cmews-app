import { ScrollView, View, RefreshControl } from 'react-native';
import { Skeleton } from '~/components/ui';
import { Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { MOCK_WEATHER_ALERTS } from '~/lib/data/weather-mock';
import { getRelativeTimeIndonesian } from '~/lib/utils/indonesian-locale';
import { LocationSelector } from '~/components/weather/location-selector';
import { HeroCard } from '~/components/weather/hero-card';
import { QuickStats } from '~/components/weather/quick-stats';
import { HourlyForecastCard } from '~/components/weather/hourly-forecast-card';
import { DetailedMetrics } from '~/components/weather/detailed-metrics';
import { DailyForecastCard } from '~/components/weather/daily-forecast-card';
import { WeatherAlertCard } from '~/components/weather/weather-alert';
import { useBreakpoint } from '~/lib/breakpoints';
import { useTheme } from '~/lib/theme-provider';
import { getThemeColor } from '~/lib/constants';
import { useWeatherStore } from '~/store/weatherStore';

export default function Home() {
  const { isDesktop } = useBreakpoint();
  const { colorScheme } = useTheme();
  const [alerts, setAlerts] = useState(MOCK_WEATHER_ALERTS);
  
  // Use real weather store
  const {
    currentWeather,
    forecast,
    location,
    loading,
    lastUpdated,
    selectedWilayah,
    fetchWeatherData,
    refreshAllData,
  } = useWeatherStore();

  const [refreshing, setRefreshing] = useState(false);

  // Fetch weather data on mount
  useEffect(() => {
    if (!currentWeather) {
      fetchWeatherData(selectedWilayah);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshAllData(selectedWilayah);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== alertId));
  };

  const handleLocationPress = () => {
    // TODO: Implement location selection modal
    console.log('Open location selector');
  };

  // Prepare data from real weather store
  const lastUpdatedText = lastUpdated ? getRelativeTimeIndonesian(new Date(lastUpdated)) : 'Belum ada data';
  const themeColors = getThemeColor(colorScheme === 'dark');

  // Prepare hourly data from first day's forecast (8 entries)
  const hourlyData = forecast.length > 0 && forecast[0]
    ? forecast[0].slice(0, 8).map((h) => ({
        time: h.datetime,
        weather: h.weatherDesc,
        temp: h.temperature,
      }))
    : [];

  // Get today's forecast summary for detailed metrics
  const todayForecast = forecast.length > 0 && forecast[0] ? forecast[0] : [];
  const todayTemps = todayForecast.map(f => f.temperature);
  const tempMin = todayTemps.length > 0 ? Math.min(...todayTemps) : 20;
  const tempMax = todayTemps.length > 0 ? Math.max(...todayTemps) : 30;

  // Show loading state if no current weather data
  const isLoading = loading || !currentWeather;

  return (
    <>
      <Stack.Screen options={{ title: 'Cuaca Hari Ini' }} />
      <ScrollView
        className="flex-1 bg-background"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[themeColors.primary]}
            tintColor={themeColors.primary}
          />
        }>
        {isLoading ? (
          // Skeleton Loading State
          <>
            <View className="px-4 pb-3 pt-4">
              <Skeleton className="mb-2 h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </View>

            <View className="mx-4 mt-2 overflow-hidden rounded-lg bg-primary/10 p-6">
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <Skeleton className="mb-2 h-16 w-32" />
                  <Skeleton className="mb-2 h-6 w-40" />
                  <Skeleton className="h-4 w-32" />
                </View>
                <Skeleton className="h-20 w-20 rounded-full" />
              </View>
            </View>

            <View className="px-4 pt-4">
              <Skeleton className="mb-3 h-6 w-32" />
              <View className="flex-row gap-3">
                {[1, 2, 3].map((_, index) => (
                  <Skeleton key={index} className="h-24 w-[140px] rounded-lg" />
                ))}
              </View>
            </View>

            <View className="px-4 pt-4">
              <Skeleton className="mb-3 h-6 w-40" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </View>
          </>
        ) : (
          <>
            {/* Location Selector */}
            <View className={isDesktop ? 'mx-auto w-full max-w-6xl' : ''}>
              <LocationSelector
                provinsi={location?.adm1 || 'Indonesia'}
                kota={location?.adm2 || 'Memuat...'}
                kecamatan={location?.adm3 || ''}
                lastUpdated={lastUpdatedText}
                onRefresh={handleRefresh}
                onLocationPress={handleLocationPress}
              />
            </View>

            {/* Weather Alerts */}
            {alerts.length > 0 && (
              <View className={`mt-2 ${isDesktop ? 'mx-auto w-full max-w-6xl px-4' : ''}`}>
                {alerts.map((alert) => (
                  <WeatherAlertCard
                    key={alert.id}
                    alert={alert}
                    onDismiss={() => handleDismissAlert(alert.id)}
                  />
                ))}
              </View>
            )}

            {/* Hero Card and Quick Stats - Responsive Layout */}
            {isDesktop ? (
              <View className="mx-auto w-full max-w-6xl px-4">
                <View className="flex-row gap-4 pt-2">
                  <View className="w-[40%]">
                    <HeroCard
                      temperature={currentWeather?.temperature || 0}
                      weather={currentWeather?.weatherDesc || 'Memuat...'}
                      location={{
                        kecamatan: location?.adm3 || '',
                        kota: location?.adm2 || '',
                        provinsi: location?.adm1 || '',
                      }}
                      lastUpdate={lastUpdatedText}
                    />
                  </View>
                  <View className="flex-1">
                    <QuickStats
                      humidity={currentWeather?.humidity || 0}
                      windSpeed={currentWeather?.windSpeed || 0}
                      feelsLike={currentWeather?.temperature || 0}
                      windDirection={currentWeather?.windDirection || 'N'}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <>
                <HeroCard
                  temperature={currentWeather?.temperature || 0}
                  weather={currentWeather?.weatherDesc || 'Memuat...'}
                  location={{
                    kecamatan: location?.adm3 || '',
                    kota: location?.adm2 || '',
                    provinsi: location?.adm1 || '',
                  }}
                  lastUpdate={lastUpdatedText}
                />

                <QuickStats
                  humidity={currentWeather?.humidity || 0}
                  windSpeed={currentWeather?.windSpeed || 0}
                  feelsLike={currentWeather?.temperature || 0}
                  windDirection={currentWeather?.windDirection || 'N'}
                />
              </>
            )}

            {/* Hourly Forecast */}
            <View className={isDesktop ? 'mx-auto w-full max-w-6xl px-4' : ''}>
              <HourlyForecastCard hourlyData={hourlyData} />
            </View>

            {/* Detailed Metrics */}
            <View className={isDesktop ? 'mx-auto w-full max-w-6xl px-4' : ''}>
              <DetailedMetrics
                temperature={{
                  current: currentWeather?.temperature || 0,
                  feelsLike: currentWeather?.temperature || 0,
                  min: tempMin,
                  max: tempMax,
                }}
                wind={{
                  speed: currentWeather?.windSpeed || 0,
                  direction: currentWeather?.windDirection || 'N',
                  gust: (currentWeather?.windSpeed || 0) + 5,
                }}
                atmospheric={{
                  pressure: 1013,
                  humidity: currentWeather?.humidity || 0,
                  visibility: parseInt(currentWeather?.visibility || '10'),
                }}
              />
            </View>

            {/* Daily Forecast */}
            <View className={isDesktop ? 'mx-auto w-full max-w-6xl px-4 pb-6' : 'px-4 pb-4'}>
              <DailyForecastCard
                forecast={forecast.map((dayForecast, index) => {
                  const firstEntry = dayForecast[0];
                  if (!firstEntry) {
                    return {
                      day: index === 0 ? 'Hari Ini' : `Hari ${index + 1}`,
                      date: new Date().toISOString(),
                      weather: 'Tidak ada data',
                      tempHigh: 0,
                      tempLow: 0,
                      precipitation: 0,
                    };
                  }
                  
                  const dateObj = new Date(firstEntry.datetime);
                  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                  const temps = dayForecast.map(f => f.temperature);
                  
                  return {
                    day: index === 0 ? 'Hari Ini' : dayNames[dateObj.getDay()],
                    date: dateObj.toISOString(),
                    weather: firstEntry.weatherDesc,
                    tempHigh: Math.max(...temps),
                    tempLow: Math.min(...temps),
                    precipitation: firstEntry.humidity,
                  };
                })}
              />
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
}
