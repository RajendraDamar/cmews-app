import { ScrollView, View, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs';
import { CloudSun, Wind, Waves, MoveHorizontal } from 'lucide-react-native';
import { ExpandableDayCard } from '~/components/forecast/expandable-day-card';
import { WindCard } from '~/components/forecast/wind-card';
import { WaveCard } from '~/components/forecast/wave-card';
import { CurrentCard } from '~/components/forecast/current-card';
import { Text } from '~/components/ui/text';
import { useBreakpoint } from '~/lib/breakpoints';
import { useWeatherStore } from '~/store/weatherStore';
import { EmptyState } from '~/components/ui/empty-state';

export default function ForecastTab() {
  const [activeTab, setActiveTab] = useState('weather');
  const { isDesktop } = useBreakpoint();
  
  // Use real weather store
  const {
    forecast,
    maritimeWeather,
    loading,
    selectedWilayah,
    fetchWeatherData,
    fetchMaritimeData,
  } = useWeatherStore();

  // Fetch data on mount
  useEffect(() => {
    if (forecast.length === 0) {
      fetchWeatherData(selectedWilayah);
    }
    if (maritimeWeather.length === 0) {
      fetchMaritimeData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Transform weather store forecast data for ExpandableDayCard
  const weatherData = forecast.map((dayForecast, index) => {
    if (dayForecast.length === 0) return null;
    
    const firstEntry = dayForecast[0];
    const dateObj = new Date(firstEntry.datetime);
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    
    return {
      day: index === 0 ? 'Hari Ini' : dayNames[dateObj.getDay()],
      date: dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      weather: firstEntry.weatherDesc,
      temperature: firstEntry.temperature,
      hourlyForecast: dayForecast.map(entry => ({
        time: new Date(entry.datetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        temperature: entry.temperature,
        weather: entry.weatherDesc,
        precipitation: entry.humidity,
      })),
    };
  }).filter(Boolean);

  // Transform forecast data for wind cards (aggregate by day)
  const windData = forecast.map((dayForecast, index) => {
    if (dayForecast.length === 0) return null;
    
    const firstEntry = dayForecast[0];
    const dateObj = new Date(firstEntry.datetime);
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    
    // Average wind speed for the day
    const avgWindSpeed = dayForecast.reduce((sum, entry) => sum + entry.windSpeed, 0) / dayForecast.length;
    
    return {
      day: index === 0 ? 'Hari Ini' : dayNames[dateObj.getDay()],
      date: dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      windSpeed: Math.round(avgWindSpeed),
      direction: firstEntry.windDirection,
      hourlyData: dayForecast.map(entry => ({
        time: new Date(entry.datetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        speed: entry.windSpeed,
        direction: entry.windDirection,
      })),
    };
  }).filter(Boolean);

  // Use maritime data or provide mock for wave/current tabs
  const waveData = maritimeWeather.slice(0, 3).map((data: any, index) => ({
    day: index === 0 ? 'Hari Ini' : `Hari ${index + 1}`,
    date: new Date(Date.now() + index * 86400000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    waveHeight: data?.tinggi_gelombang || '1.0 - 1.5',
    area: data?.wilayah || 'Perairan Jakarta',
    warning: data?.warning || null,
  }));

  const currentData = maritimeWeather.slice(0, 3).map((data: any, index) => ({
    day: index === 0 ? 'Hari Ini' : `Hari ${index + 1}`,
    date: new Date(Date.now() + index * 86400000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    speed: data?.arah_angin || 'Sedang',
    direction: data?.arah_angin || 'Timur Laut',
    area: data?.wilayah || 'Perairan Jakarta',
  }));

  if (loading && forecast.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-muted-foreground">Memuat data cuaca...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className={`p-4 ${isDesktop ? 'mx-auto w-full max-w-5xl' : ''}`}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <TabsList className="mb-4 grid grid-cols-4 gap-2">
            <TabsTrigger value="weather">
              <View className="flex-row items-center gap-1.5">
                <CloudSun size={16} />
                <Text>Cuaca</Text>
              </View>
            </TabsTrigger>
            <TabsTrigger value="wind">
              <View className="flex-row items-center gap-1.5">
                <Wind size={16} />
                <Text>Angin</Text>
              </View>
            </TabsTrigger>
            <TabsTrigger value="wave">
              <View className="flex-row items-center gap-1.5">
                <Waves size={16} />
                <Text>Gelombang</Text>
              </View>
            </TabsTrigger>
            <TabsTrigger value="current">
              <View className="flex-row items-center gap-1.5">
                <MoveHorizontal size={16} />
                <Text>Arus</Text>
              </View>
            </TabsTrigger>
          </TabsList>

          {/* Weather Tab Content */}
          <TabsContent value="weather">
            {weatherData.length > 0 ? (
              <View className="gap-3">
                {weatherData.map((day, index) => (
                  <ExpandableDayCard key={index} {...day} />
                ))}
              </View>
            ) : (
              <EmptyState
                title="Tidak Ada Data Cuaca"
                description="Tarik untuk memuat ulang"
              />
            )}
          </TabsContent>

          {/* Wind Tab Content */}
          <TabsContent value="wind">
            {windData.length > 0 ? (
              <View className="gap-3">
                {windData.map((data, index) => (
                  <WindCard key={index} {...data} />
                ))}
              </View>
            ) : (
              <EmptyState
                title="Tidak Ada Data Angin"
                description="Tarik untuk memuat ulang"
              />
            )}
          </TabsContent>

          {/* Wave Tab Content */}
          <TabsContent value="wave">
            {waveData.length > 0 ? (
              <View className="gap-3">
                {waveData.map((data, index) => (
                  <WaveCard key={index} {...data} />
                ))}
              </View>
            ) : (
              <EmptyState
                title="Tidak Ada Data Gelombang"
                description="Data maritim tidak tersedia"
              />
            )}
          </TabsContent>

          {/* Current Tab Content */}
          <TabsContent value="current">
            {currentData.length > 0 ? (
              <View className="gap-3">
                {currentData.map((data, index) => (
                  <CurrentCard key={index} {...data} />
                ))}
              </View>
            ) : (
              <EmptyState
                title="Tidak Ada Data Arus"
                description="Data maritim tidak tersedia"
              />
            )}
          </TabsContent>
        </Tabs>
      </View>
    </ScrollView>
  );
}
