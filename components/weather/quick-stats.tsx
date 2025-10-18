import React from 'react';
import { View, ScrollView } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Droplets, Thermometer } from 'lucide-react-native';
import { DirectionArrow } from '~/components/weather/direction-arrow';
import { useTheme } from '~/lib/theme-provider';
import { useBreakpoint } from '~/lib/breakpoints';
import { getThemeColor } from '~/lib/constants';

interface QuickStatsProps {
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  windDirection?: string;
}

interface StatCardProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  value: string;
  progress?: number;
}

function StatCard({ icon: Icon, label, value, progress }: StatCardProps) {
  const { colorScheme } = useTheme();
  const themeColors = getThemeColor(colorScheme === 'dark');

  return (
    <Card className="min-w-[140px]">
      <CardContent className="p-4">
        <View className="flex-row items-center gap-3">
          <Icon size={24} color={themeColors.primary} />
          <View className="flex-1">
            <Text variant="muted" size="sm">
              {label}
            </Text>
            <Text className="text-xl font-semibold">{value}</Text>
          </View>
        </View>
        {progress !== undefined && (
          <View className="mt-3">
            <View className="h-2 overflow-hidden rounded-full bg-secondary">
              <View className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
            </View>
          </View>
        )}
      </CardContent>
    </Card>
  );
}

export function QuickStats({
  humidity,
  windSpeed,
  feelsLike,
  windDirection = 'Utara',
}: QuickStatsProps) {
  const { isDesktop } = useBreakpoint();
  
  return (
    <View className="px-4 pt-4">
      <Text className="mb-3 text-lg font-semibold">Ringkasan Cepat</Text>
      {isDesktop ? (
        // Desktop: Display in a grid instead of horizontal scroll
        <View className="grid grid-cols-3 gap-3">
          <StatCard icon={Droplets} label="Kelembapan" value={`${humidity}%`} progress={humidity} />
          <Card className="min-w-[140px]">
            <CardContent className="p-4">
              <View className="flex-row items-center gap-3">
                <DirectionArrow direction={windDirection} size={24} />
                <View className="flex-1">
                  <Text variant="muted" size="sm">
                    Kecepatan Angin
                  </Text>
                  <Text className="text-xl font-semibold">{windSpeed} km/h</Text>
                </View>
              </View>
            </CardContent>
          </Card>
          <StatCard icon={Thermometer} label="Terasa Seperti" value={`${feelsLike}°`} />
        </View>
      ) : (
        // Mobile: Keep horizontal scroll
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}>
          <StatCard icon={Droplets} label="Kelembapan" value={`${humidity}%`} progress={humidity} />
          <Card className="min-w-[140px]">
            <CardContent className="p-4">
              <View className="flex-row items-center gap-3">
                <DirectionArrow direction={windDirection} size={24} />
                <View className="flex-1">
                  <Text variant="muted" size="sm">
                    Kecepatan Angin
                  </Text>
                  <Text className="text-xl font-semibold">{windSpeed} km/h</Text>
                </View>
              </View>
            </CardContent>
          </Card>
          <StatCard icon={Thermometer} label="Terasa Seperti" value={`${feelsLike}°`} />
        </ScrollView>
      )}
    </View>
  );
}
