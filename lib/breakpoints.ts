import { useWindowDimensions, Platform } from 'react-native';

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export function useBreakpoint() {
  const { width, height } = useWindowDimensions();

  // On mobile phones, rotating to landscape increases width (> 768) but smallest dimension remains small (< 600).
  // A physical tablet has smallestDimension >= 600dp (standard Android sw600dp qualifier).
  const smallestDimension = Math.min(width, height);
  const isTabletDevice = smallestDimension >= 600;

  // Desktop layout is only enabled for Web with width >= 768, or native tablets with width >= 1024.
  const isDesktop =
    Platform.OS === 'web'
      ? width >= BREAKPOINTS.md
      : isTabletDevice && width >= BREAKPOINTS.lg;

  const isTablet = isTabletDevice && width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;

  return {
    isMobile: !isDesktop,
    isTablet,
    isDesktop,
    width,
    height,
  };
}

