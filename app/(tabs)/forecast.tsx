import { ScrollView, View } from 'react-native';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs';
import { CloudSun, Wind, Waves, MoveHorizontal } from 'lucide-react-native';
import { ExpandableDayCard } from '~/components/forecast/expandable-day-card';
import { WindCard } from '~/components/forecast/wind-card';
import { WaveCard } from '~/components/forecast/wave-card';
import { CurrentCard } from '~/components/forecast/current-card';
import { mockForecastData } from '~/lib/data/forecast-mock';
import { Text } from '~/components/ui/text';
import { useBreakpoint } from '~/lib/breakpoints';

export default function ForecastTab() {
  const [activeTab, setActiveTab] = useState('weather');
  const { weather, wind, wave, current } = mockForecastData;
  const { isDesktop } = useBreakpoint();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className={`p-4 ${isDesktop ? 'mx-auto w-full max-w-4xl' : ''}`}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <TabsList className="mb-4 grid grid-cols-4">
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
              {weather.map((day, index) => (
                <ExpandableDayCard key={index} {...day} />
              ))}
            </View>
          </TabsContent>

          {/* Wind Tab Content */}
          <TabsContent value="wind">
            <View className="gap-3">
              {wind.map((data, index) => (
                <WindCard key={index} {...data} />
              ))}
            </View>
          </TabsContent>

          {/* Wave Tab Content */}
          <TabsContent value="wave">
            <View className="gap-3">
              {wave.map((data, index) => (
                <WaveCard key={index} {...data} />
              ))}
            </View>
          </TabsContent>

          {/* Current Tab Content */}
          <TabsContent value="current">
            <View className="gap-3">
              {current.map((data, index) => (
                <CurrentCard key={index} {...data} />
              ))}
            </View>
          </TabsContent>
        </Tabs>
      </View>
    </ScrollView>
  );
}
