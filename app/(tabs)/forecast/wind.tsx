import { ScrollView, View } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Badge } from '~/components/ui/badge';
import { SeaAreaCard } from '~/components/forecast/sea-area-card';
import { getWindData } from '~/lib/data/maritime-mock';
import { beaufortToDescription } from '~/lib/utils/maritime-calculations';
import { Wind, Navigation } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';

export default function WindTab() {
  const { colorScheme } = useTheme();
  const windData = getWindData();

  // Calculate average wind speed
  const avgSpeed = Math.round(
    windData.reduce((acc, d) => acc + (d.speedMin + d.speedMax) / 2, 0) / windData.length
  );

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        {/* Wind Overview */}
        <View className="mb-4">
          <Card>
            <CardContent className="p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <Wind size={32} color={colorScheme === 'dark' ? '#60a5fa' : '#3b82f6'} />
                  <View>
                    <Text variant="muted" size="sm">
                      Kecepatan Angin Rata-rata
                    </Text>
                    <Text className="text-2xl font-bold">{avgSpeed} km/h</Text>
                  </View>
                </View>
                <Navigation size={28} color={colorScheme === 'dark' ? '#60a5fa' : '#3b82f6'} />
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Sea Areas */}
        <View className="mb-3">
          <Text className="mb-3 text-lg font-semibold">Area Laut</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingBottom: 8 }}>
          {windData.map((data, index) => (
            <SeaAreaCard
              key={index}
              seaArea={data.seaArea}
              type="wind"
              data={{
                primary: `${data.speedMin}-${data.speedMax} km/h`,
                secondary: `${data.direction} (${data.directionDegrees}°)`,
                badge: {
                  label: beaufortToDescription(data.beaufortScale),
                  variant:
                    data.beaufortScale >= 7
                      ? 'destructive'
                      : data.beaufortScale >= 4
                        ? 'default'
                        : 'secondary',
                },
              }}
            />
          ))}
        </ScrollView>

        {/* Wind Details */}
        <View className="mt-4">
          <Text className="mb-3 text-lg font-semibold">Detail Angin per Area</Text>
          <View className="gap-3">
            {windData.map((data, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <View className="mb-3 flex-row items-center justify-between">
                    <Text className="text-base font-semibold">{data.seaArea}</Text>
                    <Badge
                      label={beaufortToDescription(data.beaufortScale)}
                      variant={
                        data.beaufortScale >= 7
                          ? 'destructive'
                          : data.beaufortScale >= 4
                            ? 'default'
                            : 'secondary'
                      }
                    />
                  </View>

                  <View className="gap-2">
                    <View className="flex-row justify-between">
                      <Text variant="muted" size="sm">
                        Kecepatan
                      </Text>
                      <Text className="font-semibold">
                        {data.speedMin}-{data.speedMax} km/h
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text variant="muted" size="sm">
                        Arah
                      </Text>
                      <Text className="font-semibold">
                        {data.direction} ({data.directionDegrees}°)
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text variant="muted" size="sm">
                        Hembusan Kencang
                      </Text>
                      <Text className="font-semibold">{data.gusts} km/h</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text variant="muted" size="sm">
                        Skala Beaufort
                      </Text>
                      <Text className="font-semibold">{data.beaufortScale}</Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
