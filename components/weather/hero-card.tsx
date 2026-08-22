import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from '~/components/ui/linear-gradient';
import { Text } from '~/components/ui/text';
import { AnimatedCounter } from '~/components/ui/animated-counter';
import { WeatherIcon } from './weather-icon';
import { cn } from '~/lib/utils';
import { useTheme } from '~/lib/theme-provider';

interface HeroCardProps {
  temperature: number;
  weather: string;
  location: {
    kecamatan: string;
    kota: string;
    provinsi: string;
  };
  lastUpdate: string;
}

interface WeatherAtmosphere {
  gradientColors: [string, string, ...string[]];
  haloClass: string;
  accentTag: string;
}

/**
 * Returns dynamic atmosphere styling & exact linear gradient color stops based on weather condition & theme
 */
function getWeatherAtmosphere(condition: string, isDark: boolean): WeatherAtmosphere {
  const w = (condition || '').toLowerCase();

  if (w.includes('cerah') && !w.includes('berawan')) {
    return {
      gradientColors: isDark
        ? ['#451a03', '#082f49', '#0f172a'] // Amber-950 to Sky-950 to Slate-950
        : ['#d97706', '#0284c7', '#0369a1'], // Amber-600 to Sky-600 to Sky-700
      haloClass: 'bg-amber-400/20 shadow-amber-500/20',
      accentTag: 'Cerah',
    };
  }
  if (w.includes('petir') || w.includes('hujan lebat')) {
    return {
      gradientColors: isDark
        ? ['#2e1065', '#0f172a', '#1e1b4b'] // Purple-950 to Slate-950 to Indigo-950
        : ['#3730a3', '#581c87', '#0f172a'], // Indigo-800 to Purple-900 to Slate-900
      haloClass: 'bg-purple-400/20 shadow-purple-500/20',
      accentTag: 'Ekstrem',
    };
  }
  if (w.includes('hujan') || w.includes('gerimis')) {
    return {
      gradientColors: isDark
        ? ['#0f172a', '#172554', '#082f49'] // Slate-950 to Blue-950 to Sky-950
        : ['#0369a1', '#1e40af', '#312e81'], // Sky-700 to Blue-800 to Indigo-900
      haloClass: 'bg-sky-400/20 shadow-sky-500/20',
      accentTag: 'Presipitasi',
    };
  }
  // Default / Berawan / Cerah Berawan
  if (w.includes('cerah berawan')) {
    return {
      gradientColors: isDark
        ? ['#431407', '#082f49', '#0f172a']
        : ['#ea580c', '#0284c7', '#0369a1'],
      haloClass: 'bg-orange-400/20 shadow-orange-500/20',
      accentTag: 'Cerah Berawan',
    };
  }
  return {
    gradientColors: isDark
      ? ['#082f49', '#0f172a', '#082f49'] // Sky-950 to Slate-900 to Sky-950
      : ['#0369a1', '#075985', '#1e40af'], // Sky-700 to Sky-800 to Blue-800
    haloClass: 'bg-white/15 shadow-white/10',
    accentTag: 'Berawan',
  };
}

export function HeroCard({ temperature, weather, location, lastUpdate }: HeroCardProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const atmosphere = getWeatherAtmosphere(weather, isDark);

  return (
    <LinearGradient
      colors={atmosphere.gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className={cn(
        'mx-4 mt-2 overflow-hidden rounded-2xl shadow-xl md:mx-0',
        'web:transition-all web:duration-300 web:hover:shadow-2xl web:hover:scale-[1.008]'
      )}
      style={{ borderRadius: 16 }}>
      <View className="p-6">
        <View className="flex-row items-start justify-between">
          {/* Temperature & Location Text */}
          <View className="flex-1 pr-2">
            <View className="flex-row items-baseline">
              <AnimatedCounter
                value={temperature}
                suffix="°"
                className="text-5xl font-bold tracking-tight md:text-6xl"
                style={{ color: '#ffffff' }}
              />
            </View>
            <Text
              className="mt-2.5 text-xl font-semibold"
              style={{ color: '#ffffff' }}>
              {weather}
            </Text>
            <Text
              className="mt-2 text-sm"
              style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {location.kecamatan ? `${location.kecamatan}, ` : ''}{location.kota}
            </Text>
            {location.provinsi ? (
              <Text
                className="mt-0.5 text-sm"
                style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                {location.provinsi}
              </Text>
            ) : null}
          </View>

          {/* Animated Weather Icon in Glowing Halo */}
          <View className="items-center justify-center">
            <View
              className={cn(
                'rounded-full p-2.5 shadow-lg web:transition-all web:duration-300',
                atmosphere.haloClass
              )}>
              <WeatherIcon condition={weather} size={84} animated={true} />
            </View>
          </View>
        </View>

        {/* Divider & Last Updated */}
        <View
          className="mt-5 pt-3"
          style={{
            borderTopWidth: 1,
            borderTopColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.25)',
          }}>
          <Text
            size="sm"
            style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Diperbarui {lastUpdate}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
