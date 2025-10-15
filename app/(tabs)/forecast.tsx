import { ScrollView, View } from 'react-native';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs';
import { CloudSun, Wind, Waves, MoveHorizontal } from 'lucide-react-native';
import { mockForecastData } from '~/lib/data/forecast-mock';
import { Text } from '~/components/ui/text';
import { useStore } from '~/store/store';
import { ForecastLocationSelector } from '~/components/forecast/forecast-location-selector';
import { DaySelector } from '~/components/forecast/day-selector';
import { ChartKitTemperatureChart } from '~/components/charts/ChartKitTemperatureChart';
import { ChartKitWindChart } from '~/components/charts/ChartKitWindChart';
import { ChartKitWaveChart } from '~/components/charts/ChartKitWaveChart';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { DirectionArrow } from '~/components/weather/direction-arrow';

export default function ForecastTab() {
  const [activeTab, setActiveTab] = useState('weather');
  const [selectedDay, setSelectedDay] = useState(0);
  const { selectedForecastLocation, setSelectedForecastLocation } = useStore();

  // Get location data
  const locationData = mockForecastData.locations[selectedForecastLocation || 'Laut Jawa'];

  // Prepare day options (3 days)
  const dayOptions = locationData.weather.map((day, index) => ({
    label: day.day,
    value: index,
  }));

  // Get selected day data for each forecast type
  const selectedWeather = locationData.weather[selectedDay];
  const selectedWind = locationData.wind[selectedDay];
  const selectedWave = locationData.wave[selectedDay];
  const selectedCurrent = locationData.current[selectedDay];

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="pb-4">
        {/* Location Selector */}
        <ForecastLocationSelector
          selectedLocation={selectedForecastLocation || 'Laut Jawa'}
          availableLocations={mockForecastData.availableLocations}
          onLocationChange={setSelectedForecastLocation}
        />

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

          {/* Weather Tab Content */}
          <TabsContent value="weather">
            <View className="gap-3">
              {/* Temperature Chart */}
              <View className="px-4">
                <Card>
                  <CardContent className="pt-4">
                    <ChartKitTemperatureChart
                      data={selectedWeather.hourly.map((h) => ({
                        time: h.time,
                        temp: h.temp,
                        humidity: h.humidity,
                      }))}
                    />
                  </CardContent>
                </Card>
              </View>

              {/* Day Selector */}
              <DaySelector days={dayOptions} selectedDay={selectedDay} onSelectDay={setSelectedDay} />

              {/* Weather Details Card */}
              <View className="px-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Detail Cuaca - {selectedWeather.day}</CardTitle>
                  </CardHeader>
                  <CardContent className="gap-3">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-muted-foreground">Cuaca</Text>
                      <Text className="font-semibold">{selectedWeather.weather}</Text>
                    </View>
                    <Separator />
                    <View className="flex-row items-center justify-between">
                      <Text className="text-muted-foreground">Suhu Min/Max</Text>
                      <Text className="font-semibold">
                        {selectedWeather.tempMin}° / {selectedWeather.tempMax}°
                      </Text>
                    </View>
                    <Separator />
                    <Text className="font-semibold">Detail Per 3 Jam</Text>
                    <View className="gap-2">
                      {selectedWeather.hourly.map((entry, index) => (
                        <View key={index}>
                          <View className="flex-row items-center justify-between py-2">
                            <Text className="w-16 font-medium">{entry.time}</Text>
                            <Text className="flex-1 text-center">{entry.weather}</Text>
                            <Text className="w-20 text-right font-semibold">{entry.temp}°C</Text>
                          </View>
                          {index < selectedWeather.hourly.length - 1 && <Separator />}
                        </View>
                      ))}
                    </View>
                  </CardContent>
                </Card>
              </View>
            </View>
          </TabsContent>

          {/* Wind Tab Content */}
          <TabsContent value="wind">
            <View className="gap-3">
              {/* Wind Chart */}
              <View className="px-4">
                <Card>
                  <CardContent className="pt-4">
                    <ChartKitWindChart
                      data={selectedWind.hourly.map((h) => {
                        const directionDegrees = {
                          Utara: 0,
                          'Timur Laut': 45,
                          Timur: 90,
                          Tenggara: 135,
                          Selatan: 180,
                          'Barat Daya': 225,
                          Barat: 270,
                          'Barat Laut': 315,
                        }[h.direction] || 0;
                        
                        return {
                          direction: h.direction,
                          speed: h.speed,
                          directionDegrees,
                        };
                      })}
                      animated={true}
                    />
                  </CardContent>
                </Card>
              </View>

              {/* Day Selector */}
              <DaySelector days={dayOptions} selectedDay={selectedDay} onSelectDay={setSelectedDay} />

              {/* Wind Details Card */}
              <View className="px-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Detail Angin - {selectedWind.day}</CardTitle>
                  </CardHeader>
                  <CardContent className="gap-3">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-muted-foreground">Arah Dominan</Text>
                      <View className="flex-row items-center gap-2">
                        <DirectionArrow direction={selectedWind.direction} size={20} showLabel />
                      </View>
                    </View>
                    <Separator />
                    <View className="flex-row items-center justify-between">
                      <Text className="text-muted-foreground">Kecepatan</Text>
                      <Text className="font-semibold">
                        {selectedWind.speedMin} - {selectedWind.speedMax} km/h
                      </Text>
                    </View>
                    <Separator />
                    <Text className="font-semibold">Detail Per 3 Jam</Text>
                    <View className="gap-2">
                      {selectedWind.hourly.map((entry, index) => (
                        <View key={index}>
                          <View className="flex-row items-center justify-between py-2">
                            <Text className="w-16 font-medium">{entry.time}</Text>
                            <View className="flex-1 items-center">
                              <DirectionArrow direction={entry.direction} size={20} showLabel />
                            </View>
                            <Text className="w-20 text-right font-semibold">{entry.speed} km/h</Text>
                          </View>
                          {index < selectedWind.hourly.length - 1 && <Separator />}
                        </View>
                      ))}
                    </View>
                  </CardContent>
                </Card>
              </View>
            </View>
          </TabsContent>

          {/* Wave Tab Content */}
          <TabsContent value="wave">
            <View className="gap-3">
              {/* Wave Chart */}
              <View className="px-4">
                <Card>
                  <CardContent className="pt-4">
                    <ChartKitWaveChart
                      data={selectedWave.hourly.map((h) => ({
                        time: h.time,
                        height: h.height,
                      }))}
                      animated={true}
                    />
                  </CardContent>
                </Card>
              </View>

              {/* Day Selector */}
              <DaySelector days={dayOptions} selectedDay={selectedDay} onSelectDay={setSelectedDay} />

              {/* Wave Details Card */}
              <View className="px-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Detail Gelombang - {selectedWave.day}</CardTitle>
                  </CardHeader>
                  <CardContent className="gap-3">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-muted-foreground">Kondisi Laut</Text>
                      <Text className="font-semibold">{selectedWave.seaState}</Text>
                    </View>
                    <Separator />
                    <View className="flex-row items-center justify-between">
                      <Text className="text-muted-foreground">Tinggi Gelombang</Text>
                      <Text className="font-semibold">
                        {selectedWave.heightMin} - {selectedWave.heightMax} m
                      </Text>
                    </View>
                    <Separator />
                    <View className="flex-row items-center justify-between">
                      <Text className="text-muted-foreground">Periode</Text>
                      <Text className="font-semibold">{selectedWave.period} detik</Text>
                    </View>
                    <Separator />
                    <Text className="font-semibold">Detail Per 3 Jam</Text>
                    <View className="gap-2">
                      {selectedWave.hourly.map((entry, index) => (
                        <View key={index}>
                          <View className="flex-row items-center justify-between py-2">
                            <Text className="w-16 font-medium">{entry.time}</Text>
                            <Text className="w-20 text-right font-semibold">{entry.height} m</Text>
                          </View>
                          {index < selectedWave.hourly.length - 1 && <Separator />}
                        </View>
                      ))}
                    </View>
                  </CardContent>
                </Card>
              </View>
            </View>
          </TabsContent>

          {/* Current Tab Content */}
          <TabsContent value="current">
            <View className="gap-3">
              {/* Current Chart (using wind chart for direction/speed) */}
              <View className="px-4">
                <Text className="mb-2 text-center text-sm text-muted-foreground">
                  Kecepatan Arus Laut
                </Text>
                <View className="items-center rounded-lg border border-border bg-card p-4">
                  <Text className="text-4xl font-bold">{selectedCurrent.speed} m/s</Text>
                  <View className="mt-2 flex-row items-center gap-2">
                    <DirectionArrow direction={selectedCurrent.direction} size={24} showLabel />
                  </View>
                </View>
              </View>

              {/* Day Selector */}
              <DaySelector days={dayOptions} selectedDay={selectedDay} onSelectDay={setSelectedDay} />

              {/* Current Details Card */}
              <View className="px-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Detail Arus - {selectedCurrent.day}</CardTitle>
                  </CardHeader>
                  <CardContent className="gap-3">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-muted-foreground">Arah Dominan</Text>
                      <View className="flex-row items-center gap-2">
                        <DirectionArrow direction={selectedCurrent.direction} size={20} showLabel />
                      </View>
                    </View>
                    <Separator />
                    <View className="flex-row items-center justify-between">
                      <Text className="text-muted-foreground">Kecepatan</Text>
                      <Text className="font-semibold">{selectedCurrent.speed} m/s</Text>
                    </View>
                    <Separator />
                    <Text className="font-semibold">Detail Per 3 Jam</Text>
                    <View className="gap-2">
                      {selectedCurrent.hourly.map((entry, index) => (
                        <View key={index}>
                          <View className="flex-row items-center justify-between py-2">
                            <Text className="w-16 font-medium">{entry.time}</Text>
                            <View className="flex-1 items-center">
                              <DirectionArrow direction={entry.direction} size={20} showLabel />
                            </View>
                            <Text className="w-20 text-right font-semibold">{entry.speed} m/s</Text>
                          </View>
                          {index < selectedCurrent.hourly.length - 1 && <Separator />}
                        </View>
                      ))}
                    </View>
                  </CardContent>
                </Card>
              </View>
            </View>
          </TabsContent>
        </Tabs>
      </View>
    </ScrollView>
  );
}
