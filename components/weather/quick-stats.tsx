import React from 'react';
import { View, ScrollView } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { AnimatedCounter } from '~/components/ui/animated-counter';
import { AnimatedProgressBar } from '~/components/ui/animated-progress-bar';
import { Droplets, Thermometer } from 'lucide-react-native';
import { DirectionArrow } from '~/components/weather/direction-arrow';
import { useTheme } from '~/lib/theme-provider';
import { useBreakpoint } from '~/lib/breakpoints';
import { getThemeColor } from '~/lib/constants';
import { cn } from '~/lib/utils';

interface QuickStatsProps {
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  windDirection?: string;
}

interface StatCardProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  value: number;
  suffix?: string;
  progress?: number;
}

function StatCard({ icon: Icon, label, value, suffix = '', progress }: StatCardProps) {
  const { colorScheme } = useTheme();
  const { isDesktop } = useBreakpoint();
  const themeColors = getThemeColor(colorScheme === 'dark');

  return (
    <Card
      className={cn(
        'overflow-hidden shadow-sm',
        'web:transition-all web:duration-200 web:hover:-translate-y-0.5 web:hover:shadow-md web:active:scale-[0.98]',
        isDesktop ? 'min-w-[150px] flex-1' : 'min-w-[175px]'
      )}>
      <CardContent className="p-4">
        <View className="flex-row items-center gap-3">
          <View className="items-center justify-center rounded-lg bg-primary/10 p-2">
            <Icon size={22} color={themeColors.primary} />
          </View>
          <View className="flex-1">
            <Text variant="muted" size="sm" numberOfLines={1}>
              {label}
            </Text>
            <View className="flex-row items-baseline">
              <AnimatedCounter
                value={value}
                suffix={suffix}
                className="text-xl font-semibold text-foreground"
              />
            </View>
          </View>
        </View>
        {progress !== undefined && (
          <View className="mt-3">
            <AnimatedProgressBar
              value={progress}
              max={100}
              className="h-1.5"
              indicatorClassName="bg-primary"
            />
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
  const { colorScheme } = useTheme();
  const themeColors = getThemeColor(colorScheme === 'dark');

  // Reusable cards array
  const cards = [
    <StatCard
      key="humidity"
      icon={Droplets}
      label="Kelembapan"
      value={humidity}
      suffix="%"
      progress={humidity}
    />,
    <Card
      key="wind"
      className={cn(
        'overflow-hidden shadow-sm',
        'web:transition-all web:duration-200 web:hover:-translate-y-0.5 web:hover:shadow-md web:active:scale-[0.98]',
        isDesktop ? 'min-w-[150px] flex-1' : 'min-w-[175px]'
      )}>
      <CardContent className="p-4">
        <View className="flex-row items-center gap-3">
          <View className="items-center justify-center rounded-lg bg-primary/10 p-2">
            <DirectionArrow direction={windDirection} size={22} color={themeColors.primary} />
          </View>
          <View className="flex-1">
            <Text variant="muted" size="sm" numberOfLines={1}>
              Kecepatan Angin
            </Text>
            <View className="flex-row items-baseline">
              <AnimatedCounter
                value={windSpeed}
                suffix=" km/h"
                className="text-xl font-semibold text-foreground"
              />
            </View>
          </View>
        </View>
      </CardContent>
    </Card>,
    <StatCard
      key="feels-like"
      icon={Thermometer}
      label="Terasa Seperti"
      value={feelsLike}
      suffix="°"
    />,
  ];

  return (
    <View className={isDesktop ? 'pt-2' : 'px-4 pt-4'}>
      <Text className="mb-3 text-lg font-semibold text-foreground">Ringkasan Cepat</Text>
      {isDesktop ? (
        // Desktop: Flex row with equal spacing
        <View className="flex-row gap-3">{cards}</View>
      ) : (
        // Mobile: Smooth horizontal scroll
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingRight: 20 }}>
          {cards}
        </ScrollView>
      )}
    </View>
  );
}
