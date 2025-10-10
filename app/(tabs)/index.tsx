import { ScrollView, View } from 'react-native';
import { Card, CardContent, Skeleton } from '~/components/ui';
import { Text } from '~/components/ui/text';
import { Droplets, Wind, Compass, Sun, Eye, Gauge } from 'lucide-react-native';
import { Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { MOCK_BMKG_WEATHER, MOCK_WEATHER_ALERTS } from '~/lib/data/weather-mock';
import { getRelativeTimeIndonesian, parseBMKGDateTime } from '~/lib/utils/indonesian-locale';
import { LocationSelector } from '~/components/weather/location-selector';
import { CurrentWeatherCard } from '~/components/weather/current-weather-card';
import { WeatherDetailCard } from '~/components/weather/weather-detail-card';
import { HourlyForecast } from '~/components/weather/hourly-forecast';
import { DailyForecast } from '~/components/weather/daily-forecast';
import { WeatherAlertCard } from '~/components/weather/weather-alert';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(MOCK_BMKG_WEATHER);
  const [alerts, setAlerts] = useState(MOCK_WEATHER_ALERTS);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setWeatherData(MOCK_BMKG_WEATHER);
      setLoading(false);
    }, 1000);
  };

  const handleLocationPress = () => {
    // TODO: Implement location selection modal
    console.log('Open location selector');
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== alertId));
  };

  const lastUpdatedDate = parseBMKGDateTime(weatherData.lastUpdated);
  const lastUpdatedText = getRelativeTimeIndonesian(lastUpdatedDate);

  return (
    <>
      <Stack.Screen options={{ title: 'Cuaca Hari Ini' }} />
      <ScrollView className="flex-1 bg-background">
        {loading ? (
          // Skeleton Loading State
          <>
            <View className="px-4 pb-3 pt-4">
              <Skeleton className="mb-2 h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </View>

            <Card className="mx-4 mt-2">
              <CardContent className="p-6">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Skeleton className="mb-2 h-16 w-32" />
                    <Skeleton className="mb-2 h-6 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </View>
                  <Skeleton className="h-20 w-20 rounded-full" />
                </View>
                <View className="mt-4 border-t border-border pt-3">
                  <Skeleton className="h-4 w-full" />
                </View>
              </CardContent>
            </Card>

            <View className="px-4 pt-4">
              <Skeleton className="mb-3 h-6 w-32" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-4"
                contentContainerStyle={{ gap: 12 }}>
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                  <Card key={index} className="w-24">
                    <CardContent className="items-center p-3">
                      <Skeleton className="mb-2 h-4 w-12" />
                      <Skeleton className="mb-2 h-8 w-8 rounded-full" />
                      <Skeleton className="mb-1 h-5 w-10" />
                      <Skeleton className="h-3 w-12" />
                    </CardContent>
                  </Card>
                ))}
              </ScrollView>
            </View>

            <View className="px-4 pb-4">
              <Skeleton className="mb-3 h-6 w-20" />
              <View className="flex-row flex-wrap gap-3">
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                  <Card key={index} className="min-w-[45%] flex-1">
                    <CardContent className="p-4">
                      <Skeleton className="mb-2 h-5 w-20" />
                      <Skeleton className="h-8 w-16" />
                    </CardContent>
                  </Card>
                ))}
              </View>
            </View>
          </>
        ) : (
          // Actual Content
          <>
            {/* Location Selector */}
            <LocationSelector
              provinsi={weatherData.location.provinsi}
              kota={weatherData.location.kota}
              kecamatan={weatherData.location.kecamatan}
              lastUpdated={lastUpdatedText}
              onRefresh={handleRefresh}
              onLocationPress={handleLocationPress}
            />

            {/* Weather Alerts */}
            {alerts.map((alert) => (
              <WeatherAlertCard
                key={alert.id}
                alert={alert}
                onDismiss={() => handleDismissAlert(alert.id)}
              />
            ))}

            {/* Current Weather Card */}
            <CurrentWeatherCard
              temperature={weatherData.currentWeather.temperature}
              feelsLike={weatherData.currentWeather.feelsLike}
              weatherCode={weatherData.currentWeather.weather.code}
              weatherDescription={weatherData.currentWeather.weather.description}
              location={`${weatherData.location.kecamatan}, ${weatherData.location.kota}`}
              date={new Date()}
            />

            {/* Hourly Forecast */}
            <View className="pt-4">
              <HourlyForecast hourlyData={weatherData.hourlyForecast} />
            </View>

            {/* Weather Details */}
            <View className="px-4 pb-4">
              <Text className="mb-3 text-lg font-semibold">Detail Cuaca</Text>
              <View className="flex-row flex-wrap gap-3">
                <WeatherDetailCard
                  icon={Droplets}
                  label="Kelembapan"
                  value={`${weatherData.currentWeather.humidity}%`}
                />
                <WeatherDetailCard
                  icon={Wind}
                  label="Kecepatan Angin"
                  value={`${weatherData.currentWeather.windSpeed} km/h`}
                />
                <WeatherDetailCard
                  icon={Compass}
                  label="Arah Angin"
                  value={weatherData.currentWeather.windDirection}
                />
                <WeatherDetailCard icon={Sun} label="Indeks UV" value="5" />
                <WeatherDetailCard icon={Eye} label="Jarak Pandang" value="10 km" />
                <WeatherDetailCard icon={Gauge} label="Tekanan" value="1013 hPa" />
              </View>
            </View>

            {/* Daily Forecast */}
            <DailyForecast dailyData={weatherData.dailyForecast} />
          </>
        )}
      </ScrollView>
    </>
  );
}
