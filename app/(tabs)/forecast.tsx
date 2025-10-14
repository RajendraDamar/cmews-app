import { ScrollView, View } from 'react-native';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs';
import { CloudSun, Wind, Waves, MoveHorizontal } from 'lucide-react-native';
import { LocationSelector } from '~/components/weather/location-selector';
import { DaySelector } from '~/components/forecast/day-selector';
import { TemperatureChart } from '~/components/forecast/temperature-chart';
import { PrecipitationChart } from '~/components/forecast/precipitation-chart';
import { HourlyBreakdown } from '~/components/forecast/hourly-breakdown';
import { ChartKitWindChart, ChartKitWaveChart } from '~/components/charts';
import { DirectionArrow } from '~/components/weather/direction-arrow';
import { WeatherIcon } from '~/components/forecast/weather-icon';
import { mockForecastData } from '~/lib/data/forecast-mock';
import { useStore } from '~/store/store';
import { Text } from '~/components/ui/text';
import { Card, CardContent } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';

export default function ForecastTab() {
  const [activeTab, setActiveTab] = useState('weather');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const { selectedForecastLocation } = useStore();
  const { weather, wind, wave, current } = mockForecastData;

  const handleRefresh = () => {
    // TODO: Refresh forecast data
    console.log('Refreshing forecast data...');
  };

  const handleLocationPress = () => {
    // TODO: Navigate to location picker
    console.log('Opening location picker...');
  };

  // Get current forecast based on selected day
  const selectedWeather = weather[selectedDayIndex];
  const selectedWind = wind[selectedDayIndex];
  const selectedWave = wave[selectedDayIndex];
  const selectedCurrent = current[selectedDayIndex];

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Location Selector */}
      <LocationSelector
        provinsi={selectedForecastLocation?.provinsi || 'DKI Jakarta'}
        kota={selectedForecastLocation?.kota || 'Jakarta Pusat'}
        kecamatan={selectedForecastLocation?.kecamatan || 'Menteng'}
        lastUpdated="Baru saja"
        onRefresh={handleRefresh}
        onLocationPress={handleLocationPress}
      />

      <View className="pb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <TabsList className="mx-4 mb-4 grid grid-cols-4">
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

          {/* Day Selector - shown on all tabs */}
          <DaySelector
            days={weather.map((d) => ({ day: d.day, date: d.date }))}
            selectedIndex={selectedDayIndex}
            onSelect={setSelectedDayIndex}
          />

          {/* Weather Tab Content */}
          <TabsContent value="weather">
            <View className="gap-4 px-4">
              {/* Weather Overview Card */}
              <Card>
                <CardContent className="p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold">{selectedWeather.day}</Text>
                      <Text variant="muted" size="sm">
                        {new Date(selectedWeather.date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                        })}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-4">
                      <WeatherIcon weather={selectedWeather.weather} size={48} />
                      <View className="items-end">
                        <Text className="text-2xl font-bold">
                          {selectedWeather.tempMax}° / {selectedWeather.tempMin}°
                        </Text>
                        <Text variant="muted" size="sm">
                          {selectedWeather.weather}
                        </Text>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>

              {/* Temperature Chart */}
              <Card>
                <CardContent className="p-4">
                  <Text className="mb-3 font-semibold">Grafik Suhu & Kelembapan</Text>
                  <TemperatureChart data={selectedWeather.hourly} />
                </CardContent>
              </Card>

              {/* Precipitation Chart */}
              <Card>
                <CardContent className="p-4">
                  <Text className="mb-3 font-semibold">Curah Hujan</Text>
                  <PrecipitationChart
                    data={selectedWeather.hourly.map((h) => ({
                      time: h.time,
                      precipitation: h.humidity,
                    }))}
                  />
                </CardContent>
              </Card>

              {/* Hourly Breakdown */}
              <Card>
                <CardContent className="p-4">
                  <Text className="mb-3 font-semibold">Prakiraan Per 3 Jam</Text>
                  <HourlyBreakdown hourly={selectedWeather.hourly} />
                </CardContent>
              </Card>
            </View>
          </TabsContent>

          {/* Wind Tab Content */}
          <TabsContent value="wind">
            <View className="gap-4 px-4">
              {/* Wind Overview Card */}
              <Card>
                <CardContent className="p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold">{selectedWind.day}</Text>
                      <Text variant="muted" size="sm">
                        {selectedWind.direction}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-xl font-bold">
                        {selectedWind.speedMin}-{selectedWind.speedMax} km/h
                      </Text>
                    </View>
                  </View>
                </CardContent>
              </Card>

              {/* Wind Chart */}
              <Card>
                <CardContent className="p-4">
                  <Text className="mb-3 font-semibold">Kompas Arah Angin</Text>
                  <ChartKitWindChart
                    data={selectedWind.hourly.map((h) => ({
                      direction: h.direction,
                      speed: h.speed,
                      directionDegrees: getDirectionDegrees(h.direction),
                    }))}
                    animated={true}
                  />
                </CardContent>
              </Card>

              {/* Wind Hourly Details */}
              <Card>
                <CardContent className="p-4">
                  <Text className="mb-3 font-semibold">Detail Per 3 Jam</Text>
                  <View className="gap-2">
                    {selectedWind.hourly.map((entry, index) => (
                      <View key={index}>
                        <View className="flex-row items-center justify-between py-2">
                          <Text className="w-16 font-medium">{entry.time}</Text>
                          <View className="flex-1 items-center">
                            <DirectionArrow direction={entry.direction} size={20} showLabel />
                          </View>
                          <Text className="w-24 text-right font-semibold">{entry.speed} km/h</Text>
                        </View>
                        {index < selectedWind.hourly.length - 1 && <Separator />}
                      </View>
                    ))}
                  </View>
                </CardContent>
              </Card>
            </View>
          </TabsContent>

          {/* Wave Tab Content */}
          <TabsContent value="wave">
            <View className="gap-4 px-4">
              {/* Wave Overview Card */}
              <Card>
                <CardContent className="p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold">{selectedWave.day}</Text>
                      <Text variant="muted" size="sm">
                        {selectedWave.seaState}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-xl font-bold">
                        {selectedWave.heightMin}-{selectedWave.heightMax} m
                      </Text>
                      <Text variant="muted" size="sm">
                        Periode {selectedWave.period}s
                      </Text>
                    </View>
                  </View>
                </CardContent>
              </Card>

              {/* Wave Chart */}
              <Card>
                <CardContent className="p-4">
                  <Text className="mb-3 font-semibold">Tinggi Gelombang (m)</Text>
                  <ChartKitWaveChart
                    data={selectedWave.hourly.map((h) => ({
                      time: h.time,
                      height: h.height,
                    }))}
                    animated={true}
                  />
                </CardContent>
              </Card>

              {/* Wave Hourly Details */}
              <Card>
                <CardContent className="p-4">
                  <Text className="mb-3 font-semibold">Detail Per 3 Jam</Text>
                  <View className="gap-2">
                    {selectedWave.hourly.map((entry, index) => (
                      <View key={index}>
                        <View className="flex-row items-center justify-between py-2">
                          <Text className="w-16 font-medium">{entry.time}</Text>
                          <Text className="w-24 text-right font-semibold">{entry.height} m</Text>
                        </View>
                        {index < selectedWave.hourly.length - 1 && <Separator />}
                      </View>
                    ))}
                  </View>
                </CardContent>
              </Card>
            </View>
          </TabsContent>

          {/* Current Tab Content */}
          <TabsContent value="current">
            <View className="gap-4 px-4">
              {/* Current Overview Card */}
              <Card>
                <CardContent className="p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold">{selectedCurrent.day}</Text>
                      <Text variant="muted" size="sm">
                        {selectedCurrent.direction}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-xl font-bold">{selectedCurrent.speed} m/s</Text>
                    </View>
                  </View>
                </CardContent>
              </Card>

              {/* Current Hourly Details */}
              <Card>
                <CardContent className="p-4">
                  <Text className="mb-3 font-semibold">Detail Per 3 Jam</Text>
                  <View className="gap-2">
                    {selectedCurrent.hourly.map((entry, index) => (
                      <View key={index}>
                        <View className="flex-row items-center justify-between py-2">
                          <Text className="w-16 font-medium">{entry.time}</Text>
                          <View className="flex-1 items-center">
                            <DirectionArrow direction={entry.direction} size={20} showLabel />
                          </View>
                          <Text className="w-24 text-right font-semibold">{entry.speed} m/s</Text>
                        </View>
                        {index < selectedCurrent.hourly.length - 1 && <Separator />}
                      </View>
                    ))}
                  </View>
                </CardContent>
              </Card>
            </View>
          </TabsContent>
        </Tabs>
      </View>
    </ScrollView>
  );
}

// Helper function to convert direction string to degrees
function getDirectionDegrees(dir: string): number {
  const directionMap: { [key: string]: number } = {
    Utara: 0,
    'Timur Laut': 45,
    Timur: 90,
    Tenggara: 135,
    Selatan: 180,
    'Barat Daya': 225,
    Barat: 270,
    'Barat Laut': 315,
  };
  return directionMap[dir] || 0;
}
