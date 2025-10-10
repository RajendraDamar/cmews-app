import { ScrollView, View } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Badge } from '~/components/ui/badge';
import { SeaAreaCard } from '~/components/forecast/sea-area-card';
import { getCurrentData } from '~/lib/data/maritime-mock';
import {
  getCurrentStrengthBadgeVariant,
  getCurrentStrengthColor,
  isStrongCurrent,
} from '~/lib/utils/maritime-calculations';
import { msToKnots } from '~/lib/utils/unit-converter';
import { Waves, Navigation, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';

export default function CurrentTab() {
  const { colorScheme } = useTheme();
  const currentData = getCurrentData();

  // Calculate average current speed
  const avgSpeed =
    Math.round((currentData.reduce((acc, d) => acc + d.speed, 0) / currentData.length) * 100) / 100;

  // Count strong current areas
  const strongCount = currentData.filter((d) => isStrongCurrent(d.speed)).length;

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        {/* Current Overview */}
        <View className="mb-4">
          <Card>
            <CardContent className="p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <Waves size={32} color={colorScheme === 'dark' ? '#60a5fa' : '#3b82f6'} />
                  <View>
                    <Text variant="muted" size="sm">
                      Kecepatan Arus Rata-rata
                    </Text>
                    <Text className="text-2xl font-bold">{avgSpeed} m/s</Text>
                    <Text variant="muted" size="sm">
                      ({msToKnots(avgSpeed)} knot)
                    </Text>
                  </View>
                </View>
                {strongCount > 0 && (
                  <View className="items-end">
                    <AlertTriangle size={24} color="#ef4444" />
                    <Text variant="muted" size="sm" className="mt-1">
                      {strongCount} arus kuat
                    </Text>
                  </View>
                )}
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Current Categories Legend */}
        <View className="mb-4">
          <Text className="mb-3 text-base font-semibold">Kategori Arus</Text>
          <View className="flex-row flex-wrap gap-2">
            <Badge label="0-0.25 m/s: Lemah" variant="secondary" />
            <Badge label="0.25-0.5 m/s: Sedang" variant="secondary" />
            <Badge label="0.5-1 m/s: Kuat" variant="default" />
            <Badge label="1+ m/s: Sangat Kuat" variant="destructive" />
          </View>
        </View>

        {/* Sea Areas Horizontal Scroll */}
        <View className="mb-3">
          <Text className="mb-3 text-lg font-semibold">Area Laut</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingBottom: 8 }}>
          {currentData.map((data, index) => (
            <SeaAreaCard
              key={index}
              seaArea={data.seaArea}
              type="current"
              data={{
                primary: `${data.speed} m/s`,
                secondary: `${data.direction} (${data.directionDegrees}°)`,
                badge: {
                  label: data.strength,
                  variant: getCurrentStrengthBadgeVariant(data.strength),
                },
              }}
            />
          ))}
        </ScrollView>

        {/* Current Details */}
        <View className="mt-4">
          <Text className="mb-3 text-lg font-semibold">Detail Arus per Area</Text>
          <View className="gap-3">
            {currentData.map((data, index) => {
              const isStrong = isStrongCurrent(data.speed);
              const speedInKnots = msToKnots(data.speed);

              return (
                <Card key={index}>
                  <CardContent className="p-4">
                    <View className="mb-3 flex-row items-center justify-between">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-base font-semibold">{data.seaArea}</Text>
                        {isStrong && <AlertTriangle size={16} color="#ef4444" />}
                      </View>
                      <Badge
                        label={data.strength}
                        variant={getCurrentStrengthBadgeVariant(data.strength)}
                      />
                    </View>

                    <View className="gap-2">
                      <View className="flex-row justify-between">
                        <Text variant="muted" size="sm">
                          Kecepatan (m/s)
                        </Text>
                        <Text className={`font-semibold ${getCurrentStrengthColor(data.strength)}`}>
                          {data.speed} m/s
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text variant="muted" size="sm">
                          Kecepatan (knot)
                        </Text>
                        <Text className={`font-semibold ${getCurrentStrengthColor(data.strength)}`}>
                          {speedInKnots} knot
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text variant="muted" size="sm">
                          Arah
                        </Text>
                        <View className="flex-row items-center gap-2">
                          <Navigation
                            size={14}
                            color={colorScheme === 'dark' ? '#999' : '#666'}
                            style={{ transform: [{ rotate: `${data.directionDegrees}deg` }] }}
                          />
                          <Text className="font-semibold">
                            {data.direction} ({data.directionDegrees}°)
                          </Text>
                        </View>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
