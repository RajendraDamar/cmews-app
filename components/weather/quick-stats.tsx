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
  const { isDesktop } = useBreakpoint();
  const themeColors = getThemeColor(colorScheme === 'dark');

  return (
    <Card className={isDesktop ? 'min-w-[140px] flex-1' : 'min-w-[140px]'}>
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
  
  // Reusable cards array
  const cards = [
    <StatCard key="humidity" icon={Droplets} label="Kelembapan" value={`${humidity}%`} progress={humidity} />,
    <Card key="wind" className={isDesktop ? 'min-w-[140px] flex-1' : 'min-w-[140px]'}>
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
    </Card>,
    <StatCard key="feels-like" icon={Thermometer} label="Terasa Seperti" value={`${feelsLike}°`} />,
  ];
  
  return (
    <View className={isDesktop ? 'pt-2' : 'px-4 pt-4'}>
      <Text className="mb-3 text-lg font-semibold">Ringkasan Cepat</Text>
      {isDesktop ? (
        // Desktop: Display in a flex row with equal spacing
        <View className="flex-row gap-3">
          {cards}
        </View>
      ) : (
        // Mobile: Keep horizontal scroll
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}>
          {cards}
        </ScrollView>
      )}
    </View>
  );
}
