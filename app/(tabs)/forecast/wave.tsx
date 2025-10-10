import { ScrollView, View } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Badge } from '~/components/ui/badge';
import { SeaAreaCard } from '~/components/forecast/sea-area-card';
import { getWaveData } from '~/lib/data/maritime-mock';
import {
  getSeaStateBadgeVariant,
  getWaveHeightColor,
  isDangerousWaveHeight,
} from '~/lib/utils/maritime-calculations';
import { Waves, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';

export default function WaveTab() {
  const { colorScheme } = useTheme();
  const waveData = getWaveData();

  // Calculate average significant wave height
  const avgHeight =
    Math.round((waveData.reduce((acc, d) => acc + d.significantHeight, 0) / waveData.length) * 10) /
    10;

  // Count dangerous areas
  const dangerousCount = waveData.filter((d) => isDangerousWaveHeight(d.significantHeight)).length;

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        {/* Wave Overview */}
        <View className="mb-4">
          <Card>
            <CardContent className="p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <Waves size={32} color={colorScheme === 'dark' ? '#60a5fa' : '#3b82f6'} />
                  <View>
                    <Text variant="muted" size="sm">
                      Tinggi Gelombang Rata-rata
                    </Text>
                    <Text className="text-2xl font-bold">{avgHeight} m</Text>
                  </View>
                </View>
                {dangerousCount > 0 && (
                  <View className="items-end">
                    <AlertTriangle size={24} color="#ef4444" />
                    <Text variant="muted" size="sm" className="mt-1">
                      {dangerousCount} area berbahaya
                    </Text>
                  </View>
                )}
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Wave Categories Legend */}
        <View className="mb-4">
          <Text className="mb-3 text-base font-semibold">Kategori Gelombang</Text>
          <View className="flex-row flex-wrap gap-2">
            <Badge label="0-0.5m: Tenang" variant="secondary" />
            <Badge label="0.5-1.25m: Berombak" variant="secondary" />
            <Badge label="1.25-2.5m: Sedang" variant="default" />
            <Badge label="2.5-4m: Kasar" variant="destructive" />
            <Badge label="4m+: Sangat Kasar" variant="destructive" />
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
          {waveData.map((data, index) => (
            <SeaAreaCard
              key={index}
              seaArea={data.seaArea}
              type="wave"
              data={{
                primary: `${data.heightMin}-${data.heightMax} m`,
                secondary: `Signifikan: ${data.significantHeight} m`,
                badge: {
                  label: data.seaState,
                  variant: getSeaStateBadgeVariant(data.seaState),
                },
              }}
            />
          ))}
        </ScrollView>

        {/* Wave Details */}
        <View className="mt-4">
          <Text className="mb-3 text-lg font-semibold">Detail Gelombang per Area</Text>
          <View className="gap-3">
            {waveData.map((data, index) => {
              const isDangerous = isDangerousWaveHeight(data.significantHeight);

              return (
                <Card key={index}>
                  <CardContent className="p-4">
                    <View className="mb-3 flex-row items-center justify-between">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-base font-semibold">{data.seaArea}</Text>
                        {isDangerous && <AlertTriangle size={16} color="#ef4444" />}
                      </View>
                      <Badge
                        label={data.seaState}
                        variant={getSeaStateBadgeVariant(data.seaState)}
                      />
                    </View>

                    <View className="gap-2">
                      <View className="flex-row justify-between">
                        <Text variant="muted" size="sm">
                          Tinggi Minimum
                        </Text>
                        <Text className={`font-semibold ${getWaveHeightColor(data.heightMin)}`}>
                          {data.heightMin} m
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text variant="muted" size="sm">
                          Tinggi Maksimum
                        </Text>
                        <Text className={`font-semibold ${getWaveHeightColor(data.heightMax)}`}>
                          {data.heightMax} m
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text variant="muted" size="sm">
                          Tinggi Signifikan
                        </Text>
                        <Text
                          className={`font-semibold ${getWaveHeightColor(data.significantHeight)}`}>
                          {data.significantHeight} m
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text variant="muted" size="sm">
                          Periode
                        </Text>
                        <Text className="font-semibold">{data.period} detik</Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text variant="muted" size="sm">
                          Arah
                        </Text>
                        <Text className="font-semibold">{data.direction}</Text>
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
