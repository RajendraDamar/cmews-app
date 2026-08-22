import React, { useEffect } from 'react';
import { View, Platform, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '~/lib/theme-provider';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudLightning,
  CloudFog,
} from 'lucide-react-native';
import { cn } from '~/lib/utils';

interface WeatherIconProps {
  condition: string;
  size?: number;
  animated?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function WeatherIcon({
  condition,
  size = 48,
  animated = true,
  className,
  style,
}: WeatherIconProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const weatherLower = (condition || '').toLowerCase();

  let IconComponent = Cloud;
  let iconColor = isDark ? '#f8fafc' : '#334155';
  let backgroundColor = isDark ? '#1e293b' : '#e2e8f0';
  let animationType: 'sun' | 'cloud' | 'rain' | 'storm' | 'none' = 'none';

  if (weatherLower.includes('cerah') && !weatherLower.includes('berawan')) {
    IconComponent = Sun;
    iconColor = isDark ? '#fbbf24' : '#d97706';
    backgroundColor = isDark ? '#451a03' : '#fef3c7';
    animationType = 'sun';
  } else if (weatherLower.includes('cerah berawan')) {
    IconComponent = CloudSun;
    iconColor = isDark ? '#fdba74' : '#c2410c';
    backgroundColor = isDark ? '#431407' : '#ffedd5';
    animationType = 'cloud';
  } else if (weatherLower.includes('berawan')) {
    IconComponent = Cloud;
    iconColor = isDark ? '#e2e8f0' : '#475569';
    backgroundColor = isDark ? '#334155' : '#e2e8f0';
    animationType = 'cloud';
  } else if (weatherLower.includes('hujan lebat') || weatherLower.includes('petir')) {
    IconComponent = weatherLower.includes('petir') ? CloudLightning : CloudRainWind;
    iconColor = isDark ? '#c084fc' : '#6d28d9';
    backgroundColor = isDark ? '#3b0764' : '#f3e8ff';
    animationType = 'storm';
  } else if (weatherLower.includes('hujan sedang') || weatherLower.includes('hujan')) {
    IconComponent = CloudRain;
    iconColor = isDark ? '#60a5fa' : '#1d4ed8';
    backgroundColor = isDark ? '#172554' : '#dbeafe';
    animationType = 'rain';
  } else if (weatherLower.includes('hujan ringan') || weatherLower.includes('gerimis')) {
    IconComponent = CloudDrizzle;
    iconColor = isDark ? '#38bdf8' : '#0284c7';
    backgroundColor = isDark ? '#082f49' : '#e0f2fe';
    animationType = 'rain';
  } else if (weatherLower.includes('kabut') || weatherLower.includes('asap')) {
    IconComponent = CloudFog;
    iconColor = isDark ? '#cbd5e1' : '#475569';
    backgroundColor = isDark ? '#1e293b' : '#f1f5f9';
    animationType = 'cloud';
  }

  // Native Reanimated micro-kinetics
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (Platform.OS !== 'web' && animated) {
      if (animationType === 'sun' || animationType === 'storm') {
        scale.value = withRepeat(
          withSequence(
            withTiming(1.06, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
            withTiming(1.0, { duration: 1800, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
      } else if (animationType === 'cloud' || animationType === 'rain') {
        translateY.value = withRepeat(
          withSequence(
            withTiming(-3, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
      }
    }
  }, [animationType, animated, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const iconSize = size * 0.55;

  // Web CSS animation class selection
  const webAnimationClass = !animated
    ? ''
    : animationType === 'sun' || animationType === 'storm'
      ? 'animate-pulse-subtle'
      : animationType === 'cloud' || animationType === 'rain'
        ? 'animate-float-drift'
        : '';

  if (Platform.OS === 'web') {
    return (
      <View
        className={cn(
          'items-center justify-center rounded-full web:transition-all web:duration-300',
          webAnimationClass,
          className
        )}
        style={[
          {
            width: size,
            height: size,
            backgroundColor,
          },
          style,
        ]}>
        <IconComponent size={iconSize} color={iconColor} />
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          backgroundColor,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center',
        },
        animated ? animatedStyle : undefined,
        style,
      ]}>
      <IconComponent size={iconSize} color={iconColor} />
    </Animated.View>
  );
}
