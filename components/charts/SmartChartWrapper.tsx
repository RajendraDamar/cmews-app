import React, { ReactNode } from 'react';
import { View, Platform, ActivityIndicator } from 'react-native';
import { Text } from '~/components/ui/text';
import { useCanvasKitLoader } from '~/lib/canvaskit-loader';

interface SmartChartWrapperProps {
  /**
   * Chart component to render (Skia-based)
   */
  children: ReactNode;
  
  /**
   * Height of the chart (for loading placeholder)
   */
  height?: number;
  
  /**
   * Optional loading message
   */
  loadingMessage?: string;
  
  /**
   * Optional error fallback component
   */
  errorFallback?: ReactNode;
}

/**
 * Smart Chart Wrapper
 * 
 * Handles CanvasKit loading on web platform while allowing native platforms
 * to render immediately.
 * 
 * Features:
 * - Auto-loads CanvasKit on web
 * - Shows loading state during CanvasKit download
 * - Provides error handling with graceful fallback
 * - Zero overhead on native platforms
 * 
 * Usage:
 * ```tsx
 * <SmartChartWrapper height={220}>
 *   <SkiaTemperatureChart data={chartData} />
 * </SmartChartWrapper>
 * ```
 */
export function SmartChartWrapper({
  children,
  height = 220,
  loadingMessage = 'Memuat grafik...',
  errorFallback,
}: SmartChartWrapperProps) {
  // On native platforms, CanvasKit loading is instant (not needed)
  // On web, this hook will load CanvasKit asynchronously
  const { isReady, isLoading, error } = useCanvasKitLoader();

  // Native platforms: render immediately
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  // Web platform with error
  if (error) {
    if (errorFallback) {
      return <>{errorFallback}</>;
    }
    
    return (
      <View 
        style={{ height, justifyContent: 'center', alignItems: 'center' }}
        className="rounded-lg bg-muted/50"
      >
        <Text variant="muted" size="sm" className="text-center px-4">
          Grafik tidak dapat dimuat.{'\n'}
          Silakan refresh halaman.
        </Text>
      </View>
    );
  }

  // Web platform: loading CanvasKit
  if (isLoading || !isReady) {
    return (
      <View 
        style={{ height, justifyContent: 'center', alignItems: 'center' }}
        className="rounded-lg bg-muted/50"
      >
        <ActivityIndicator size="large" />
        <Text variant="muted" size="sm" className="mt-2">
          {loadingMessage}
        </Text>
      </View>
    );
  }

  // Web platform: CanvasKit ready, render chart
  return <>{children}</>;
}
