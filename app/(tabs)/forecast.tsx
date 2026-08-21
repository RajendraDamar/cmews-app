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
import { PageTransition } from '~/components/ui/page-transition';
import { MARITIME_MOCK_DATA } from '~/lib/data/maritime-mock';
import { useTheme } from '~/lib/theme-provider';

export default function ForecastTab() {
  const [activeTab, setActiveTab] = useState('weather');
  const { isDesktop } = useBreakpoint();
  const { colorScheme } = useTheme();

  const activeIconColor = colorScheme === 'dark' ? '#f9fafb' : '#0f172a';
  const inactiveIconColor = colorScheme === 'dark' ? '#94a3b8' : '#64748b';
  
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
    const temps = dayForecast.map(e => e.temperature);
    
    return {
      day: index === 0 ? 'Hari Ini' : dayNames[dateObj.getDay()],
      date: firstEntry.datetime,
      weather: firstEntry.weatherDesc,
      tempMin: Math.min(...temps),
      tempMax: Math.max(...temps),
      hourly: dayForecast.map(entry => ({
        time: new Date(entry.datetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        weather: entry.weatherDesc,
        temp: entry.temperature,
        humidity: entry.humidity,
      })),
    };
  }).filter(Boolean);

  // Transform forecast data for wind cards
  const windData = forecast.map((dayForecast) => {
    if (dayForecast.length === 0) return null;
    
    const firstEntry = dayForecast[0];
    const speeds = dayForecast.map(e => e.windSpeed);
    
    return {
      seaArea: 'Perairan Indonesia',
      direction: firstEntry.windDirection,
      speedMin: Math.min(...speeds),
      speedMax: Math.max(...speeds),
      hourly: dayForecast.map(entry => ({
        time: new Date(entry.datetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        speed: entry.windSpeed,
        direction: entry.windDirection,
      })),
    };
  }).filter(Boolean);

  // Use maritime data or provide mock fallback for wave/current tabs
  const rawWaveList = maritimeWeather.length > 0 ? maritimeWeather : MARITIME_MOCK_DATA.wave;
  const waveData = rawWaveList.slice(0, 5).map((data: any, index: number) => ({
    seaArea: data?.wilayah || data?.seaArea || `Perairan ${index + 1}`,
    heightMin: data?.heightMin ?? parseFloat(data?.wave_desc?.split('-')[0]) ?? 1.0,
    heightMax: data?.heightMax ?? parseFloat(data?.wave_desc?.split('-')[1]) ?? 2.5,
    period: data?.period ?? 6,
    seaState: data?.seaState || data?.wave_cat || 'Sedang',
    hourly: [
      { time: '06:00', height: 1.2 },
      { time: '12:00', height: 1.5 },
      { time: '18:00', height: 1.3 },
    ],
  }));

  const rawCurrentList = maritimeWeather.length > 0 ? maritimeWeather : MARITIME_MOCK_DATA.current;
  const currentData = rawCurrentList.slice(0, 5).map((data: any, index: number) => ({
    seaArea: data?.wilayah || data?.seaArea || `Perairan ${index + 1}`,
    speed: data?.speed ?? 0.5,
    direction: data?.direction || data?.arah_angin || 'Timur Laut',
    hourly: [
      { time: '06:00', speed: 0.4, direction: 'Timur' },
      { time: '12:00', speed: 0.6, direction: 'Timur Laut' },
      { time: '18:00', speed: 0.5, direction: 'Utara' },
    ],
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
    <ScrollView
      className={colorScheme === 'dark' ? 'dark flex-1 bg-background' : 'flex-1 bg-background'}
      style={{
        backgroundColor: colorScheme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)',
      }}>
      <PageTransition>
        <View className={`p-4 ${isDesktop ? 'mx-auto w-full max-w-5xl' : ''}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab Navigation */}
            <TabsList className="mb-4 flex-row w-full gap-2">
              <TabsTrigger value="weather" className="flex-1">
                <View className="flex-row items-center gap-1.5">
                  <CloudSun size={16} color={activeTab === 'weather' ? activeIconColor : inactiveIconColor} />
                  <Text>Cuaca</Text>
                </View>
              </TabsTrigger>
              <TabsTrigger value="wind" className="flex-1">
                <View className="flex-row items-center gap-1.5">
                  <Wind size={16} color={activeTab === 'wind' ? activeIconColor : inactiveIconColor} />
                  <Text>Angin</Text>
                </View>
              </TabsTrigger>
              <TabsTrigger value="wave" className="flex-1">
                <View className="flex-row items-center gap-1.5">
                  <Waves size={16} color={activeTab === 'wave' ? activeIconColor : inactiveIconColor} />
                  <Text>Gelombang</Text>
                </View>
              </TabsTrigger>
              <TabsTrigger value="current" className="flex-1">
                <View className="flex-row items-center gap-1.5">
                  <MoveHorizontal size={16} color={activeTab === 'current' ? activeIconColor : inactiveIconColor} />
                  <Text>Arus</Text>
                </View>
              </TabsTrigger>
            </TabsList>

            {/* Weather Tab Content */}
            <TabsContent value="weather">
              {weatherData.length > 0 ? (
                <View className="gap-3">
                  {weatherData.map((day: any, index) => (
                    <ExpandableDayCard key={index} {...day} />
                  ))}
                </View>
              ) : (
                <EmptyState
                  title="Tidak Ada Data Cuaca"
                  message="Tarik untuk memuat ulang"
                />
              )}
            </TabsContent>

            {/* Wind Tab Content */}
            <TabsContent value="wind">
              {windData.length > 0 ? (
                <View className="gap-3">
                  {windData.map((data: any, index) => (
                    <WindCard key={index} {...data} />
                  ))}
                </View>
              ) : (
                <EmptyState
                  title="Tidak Ada Data Angin"
                  message="Tarik untuk memuat ulang"
                />
              )}
            </TabsContent>

            {/* Wave Tab Content */}
            <TabsContent value="wave">
              {waveData.length > 0 ? (
                <View className="gap-3">
                  {waveData.map((data: any, index) => (
                    <WaveCard key={index} {...data} />
                  ))}
                </View>
              ) : (
                <EmptyState
                  title="Tidak Ada Data Gelombang"
                  message="Data maritim tidak tersedia"
                />
              )}
            </TabsContent>

            {/* Current Tab Content */}
            <TabsContent value="current">
              {currentData.length > 0 ? (
                <View className="gap-3">
                  {currentData.map((data: any, index) => (
                    <CurrentCard key={index} {...data} />
                  ))}
                </View>
              ) : (
                <EmptyState
                  title="Tidak Ada Data Arus"
                  message="Data maritim tidak tersedia"
                />
              )}
            </TabsContent>
          </Tabs>
        </View>
      </PageTransition>
    </ScrollView>
  );
}
