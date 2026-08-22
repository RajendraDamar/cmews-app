import React, { useId, useState } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Platform, LayoutChangeEvent } from 'react-native';
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Rect } from 'react-native-svg';
import { cn } from '~/lib/utils';

export interface LinearGradientProps {
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  locations?: number[];
  style?: StyleProp<ViewStyle>;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Robust cross-platform LinearGradient component.
 * Uses react-native-svg on Native to guarantee compatibility with existing prebuilt dev clients,
 * and CSS linear-gradient on Web for native GPU compositor performance.
 */
export function LinearGradient({
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  locations,
  style,
  className,
  children,
}: LinearGradientProps) {
  const rawId = useId();
  const gradId = `grad-${rawId.replace(/[^a-zA-Z0-9-_]/g, '')}`;
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0 && (width !== dimensions.width || height !== dimensions.height)) {
      setDimensions({ width, height });
    }
  };

  if (Platform.OS === 'web') {
    // Calculate CSS linear-gradient angle from start/end coordinates
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = Math.round((angleRad * (180 / Math.PI) + 90 + 360) % 360);

    const stops = colors.map((color, index) => {
      const stopLoc = locations && locations[index] !== undefined
        ? `${locations[index] * 100}%`
        : `${(index / Math.max(colors.length - 1, 1)) * 100}%`;
      return `${color} ${stopLoc}`;
    }).join(', ');

    return (
      <View
        className={cn('relative overflow-hidden', className)}
        style={StyleSheet.flatten([
          {
            backgroundImage: `linear-gradient(${angleDeg}deg, ${stops})`,
          } as any,
          style,
        ])}>
        {children}
      </View>
    );
  }

  // Native (Android & iOS) via react-native-svg with full bounding box coverage
  return (
    <View
      onLayout={handleLayout}
      className={cn('relative overflow-hidden', className)}
      style={style}>
      <Svg
        width="100%"
        height="100%"
        viewBox={dimensions.width > 0 ? `0 0 ${dimensions.width} ${dimensions.height}` : '0 0 100 100'}
        style={StyleSheet.absoluteFillObject}
        preserveAspectRatio="none">
        <Defs>
          <SvgGradient
            id={gradId}
            x1={`${start.x * 100}%`}
            y1={`${start.y * 100}%`}
            x2={`${end.x * 100}%`}
            y2={`${end.y * 100}%`}>
            {colors.map((color, index) => {
              const offset = locations && locations[index] !== undefined
                ? `${locations[index] * 100}%`
                : `${(index / Math.max(colors.length - 1, 1)) * 100}%`;
              return <Stop key={index} offset={offset} stopColor={color} />;
            })}
          </SvgGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width={dimensions.width > 0 ? dimensions.width : '100%'}
          height={dimensions.height > 0 ? dimensions.height : '100%'}
          fill={`url(#${gradId})`}
        />
      </Svg>
      {children}
    </View>
  );
}
