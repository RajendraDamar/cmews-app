import { View } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Separator } from '~/components/ui/separator';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '~/components/ui/collapsible';
import { ChevronDown, Waves } from 'lucide-react-native';
import { SkiaWaveChart, SmartChartWrapper } from '~/components/charts';
import type { WaveForecastData } from '~/lib/types/forecast';
import { useState } from 'react';
import { useTheme } from '~/lib/theme-provider';

export function WaveCard({
  seaArea,
  heightMin,
  heightMax,
  period,
  seaState,
  hourly,
}: WaveForecastData) {
  const [isOpen, setIsOpen] = useState(false);
  const { colorScheme } = useTheme();

  // Prepare chart data for SkiaWaveChart
  const waveChartData = hourly.map((h) => ({
    time: h.time,
    height: h.height,
  }));

  // Determine severity color based on average height
  const avgHeight = (heightMin + heightMax) / 2;
  let severityColor = '#10b981'; // green
  let severityBg = 'bg-green-500/20';

  if (avgHeight >= 2.5) {
    severityColor = '#ef4444'; // red
    severityBg = 'bg-red-500/20';
  } else if (avgHeight >= 1.25) {
    severityColor = '#f97316'; // orange
    severityBg = 'bg-orange-500/20';
  } else if (avgHeight >= 0.5) {
    severityColor = '#eab308'; // yellow
    severityBg = 'bg-yellow-500/20';
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardContent className="p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-semibold">{seaArea}</Text>
                <Text variant="muted" size="sm">
                  {seaState}
                </Text>
              </View>

              <View className="flex-row items-center gap-4">
                <View className={`${severityBg} rounded-full p-2`}>
                  <Waves size={24} color={severityColor} />
                </View>

                <View className="items-end">
                  <Text className="font-bold">
                    {heightMin}-{heightMax} m
                  </Text>
                  <Text variant="muted" size="sm">
                    Periode {period}s
                  </Text>
                </View>

                <ChevronDown
                  size={20}
                  color={colorScheme === 'dark' ? '#888' : '#666'}
                  style={{
                    transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
                  }}
                />
              </View>
            </View>
          </CardContent>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="px-4 pb-4">
            <Separator className="mb-3" />

            {/* Wave Height Chart */}
            <Text className="mb-2 font-semibold">Tinggi Gelombang (m)</Text>
            <SmartChartWrapper height={220} loadingMessage="Memuat grafik gelombang...">
              <SkiaWaveChart data={waveChartData} animated={true} />
            </SmartChartWrapper>

            <Separator className="my-4" />

            {/* Hourly Breakdown */}
            <Text className="mb-2 font-semibold">Detail Per 3 Jam</Text>
            <View className="gap-2">
              {hourly.map((entry, index) => (
                <View key={index}>
                  <View className="flex-row items-center justify-between py-2">
                    <Text className="w-16 font-medium">{entry.time}</Text>
                    <Text className="w-20 text-right font-semibold">{entry.height} m</Text>
                  </View>
                  {index < hourly.length - 1 && <Separator />}
                </View>
              ))}
            </View>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
