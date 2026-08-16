import { useWindowDimensions } from 'react-native';

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export function useBreakpoint() {
  const { width } = useWindowDimensions();

  return {
    isMobile: width < BREAKPOINTS.md,
    isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
    // Match the 768 px (BREAKPOINTS.md) threshold used by app/(tabs)/_layout.tsx.
    // Previously this was BREAKPOINTS.lg (1024 px), causing screens to render
    // mobile UI while the layout was already showing the desktop sidebar.
    isDesktop: width >= BREAKPOINTS.md,
    width,
  };
}
