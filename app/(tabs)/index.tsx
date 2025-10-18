import { ScrollView, View, RefreshControl } from 'react-native';
import { Skeleton } from '~/components/ui';
import { Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { MOCK_BMKG_WEATHER, MOCK_WEATHER_ALERTS } from '~/lib/data/weather-mock';
import { getRelativeTimeIndonesian, parseBMKGDateTime } from '~/lib/utils/indonesian-locale';
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

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [weatherData, setWeatherData] = useState(MOCK_BMKG_WEATHER);
  const [alerts, setAlerts] = useState(MOCK_WEATHER_ALERTS);
  const { isDesktop } = useBreakpoint();
  const { colorScheme } = useTheme();

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setWeatherData(MOCK_BMKG_WEATHER);
      setAlerts(MOCK_WEATHER_ALERTS);
      setRefreshing(false);
    }, 1000);
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== alertId));
  };

  const handleLocationPress = () => {
    // TODO: Implement location selection modal
    console.log('Open location selector');
  };

  const lastUpdatedDate = parseBMKGDateTime(weatherData.lastUpdated);
  const lastUpdatedText = getRelativeTimeIndonesian(lastUpdatedDate);
  const themeColors = getThemeColor(colorScheme === 'dark');

  // Prepare data for new components
  const hourlyData = weatherData.hourlyForecast.slice(0, 8).map((h) => ({
    time: h.datetime,
    weather: h.weather.description,
    temp: h.temperature,
  }));

  const dailyForecast = weatherData.dailyForecast[0];

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
        {loading ? (
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
                provinsi={weatherData.location.provinsi}
                kota={weatherData.location.kota}
                kecamatan={weatherData.location.kecamatan}
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
                      temperature={weatherData.currentWeather.temperature}
                      weather={weatherData.currentWeather.weather.description}
                      location={{
                        kecamatan: weatherData.location.kecamatan,
                        kota: weatherData.location.kota,
                        provinsi: weatherData.location.provinsi,
                      }}
                      lastUpdate={lastUpdatedText}
                    />
                  </View>
                  <View className="flex-1">
                    <QuickStats
                      humidity={weatherData.currentWeather.humidity}
                      windSpeed={weatherData.currentWeather.windSpeed}
                      feelsLike={weatherData.currentWeather.feelsLike}
                      windDirection={weatherData.currentWeather.windDirection}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <>
                <HeroCard
                  temperature={weatherData.currentWeather.temperature}
                  weather={weatherData.currentWeather.weather.description}
                  location={{
                    kecamatan: weatherData.location.kecamatan,
                    kota: weatherData.location.kota,
                    provinsi: weatherData.location.provinsi,
                  }}
                  lastUpdate={lastUpdatedText}
                />

                <QuickStats
                  humidity={weatherData.currentWeather.humidity}
                  windSpeed={weatherData.currentWeather.windSpeed}
                  feelsLike={weatherData.currentWeather.feelsLike}
                  windDirection={weatherData.currentWeather.windDirection}
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
                  current: weatherData.currentWeather.temperature,
                  feelsLike: weatherData.currentWeather.feelsLike,
                  min: dailyForecast.tempMin,
                  max: dailyForecast.tempMax,
                }}
                wind={{
                  speed: weatherData.currentWeather.windSpeed,
                  direction: weatherData.currentWeather.windDirection,
                  gust: weatherData.currentWeather.windSpeed + 5,
                }}
                atmospheric={{
                  pressure: 1013,
                  humidity: weatherData.currentWeather.humidity,
                  visibility: 10,
                }}
              />
            </View>

            {/* Daily Forecast */}
            <View className={isDesktop ? 'mx-auto w-full max-w-6xl px-4 pb-6' : 'px-4 pb-4'}>
              <DailyForecastCard
                forecast={weatherData.dailyForecast.map((d, index) => {
                  const dateObj = new Date(
                    d.date.substring(0, 4) +
                      '-' +
                      d.date.substring(4, 6) +
                      '-' +
                      d.date.substring(6, 8)
                  );
                  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                  return {
                    day: index === 0 ? 'Hari Ini' : dayNames[dateObj.getDay()],
                    date: dateObj.toISOString(),
                    weather: d.weather.description,
                    tempHigh: d.tempMax,
                    tempLow: d.tempMin,
                    precipitation: d.precipitation || d.humidity || 50,
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
