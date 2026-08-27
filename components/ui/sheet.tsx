// Sheet Component for Bottom Sheet with Platform-Optimized Decoupled Animations
import * as React from 'react';
import {
  View,
  Modal,
  Animated,
  useWindowDimensions,
  Pressable,
  Platform,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { cn } from '~/lib/utils';
import { useTheme } from '~/lib/theme-provider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Conditionally load Reanimated layout animations for native
let ReanimatedAnimated: any = null;
let FadeIn: any, FadeOut: any, SlideInDown: any, SlideOutDown: any;
if (Platform.OS !== 'web') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Reanimated = require('react-native-reanimated');
    ReanimatedAnimated = Reanimated.default;
    FadeIn = Reanimated.FadeIn;
    FadeOut = Reanimated.FadeOut;
    SlideInDown = Reanimated.SlideInDown;
    SlideOutDown = Reanimated.SlideOutDown;
  } catch {
    console.warn('Reanimated not available in Sheet');
  }
}

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

const SheetContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  open: false,
  onOpenChange: () => { },
});

export function useSheet() {
  return React.useContext(SheetContext);
}

function WebSheet({ open, onOpenChange, children }: SheetProps) {
  const [mounted, setMounted] = React.useState(open);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(650)).current;

  React.useEffect(() => {
    if (open) {
      setMounted(true);
      fadeAnim.setValue(0);
      slideAnim.setValue(650);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: false,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 260,
          useNativeDriver: false,
        }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: false,
        }),
        Animated.timing(slideAnim, {
          toValue: 650,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setMounted(false);
      });
    }
  }, [open, mounted, fadeAnim, slideAnim]);

  const handleClose = React.useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  if (!mounted) return null;

  return (
    <SheetContext.Provider value={{ open, onOpenChange: handleClose }}>
      {/* In-tree overlay container positioned within the web content */}
      <View
        pointerEvents="box-none"
        style={{
          position: Platform.OS === 'web' ? 'fixed' : 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100, // Increased zIndex to cover the tab bar (which is zIndex: 50)
          justifyContent: 'flex-end',
        } as any}>
        {/* Independent Fade-in Dark Backdrop */}
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            opacity: fadeAnim,
          }}>
          <Pressable
            style={{ flex: 1 }}
            onPress={handleClose}
            accessibilityLabel="Tutup"
          />
        </Animated.View>

        {/* Independent Slide-up Sheet Card */}
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            zIndex: 45,
          }}>
          {children}
        </Animated.View>
      </View>
    </SheetContext.Provider>
  );
}

function NativeSheet({ open, onOpenChange, children }: SheetProps) {
  if (!open) return null;

  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      <Modal
        visible={open}
        transparent
        animationType="none"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => onOpenChange(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          {/* Static Fade-In Dark Backdrop (FadeIn / FadeOut) */}
          {ReanimatedAnimated ? (
            <ReanimatedAnimated.View
              entering={FadeIn?.duration?.(200)}
              exiting={FadeOut?.duration?.(150)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}>
              <Pressable
                style={{ flex: 1 }}
                onPress={() => onOpenChange(false)}
                accessibilityLabel="Tutup"
              />
            </ReanimatedAnimated.View>
          ) : (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}>
              <Pressable
                style={{ flex: 1 }}
                onPress={() => onOpenChange(false)}
                accessibilityLabel="Tutup"
              />
            </View>
          )}

          {/* Sliding Sheet Card (SlideInDown / SlideOutDown) */}
          {ReanimatedAnimated ? (
            <ReanimatedAnimated.View
              entering={SlideInDown?.duration?.(260)}
              exiting={SlideOutDown?.duration?.(200)}
              style={{ zIndex: 10 }}>
              {children}
            </ReanimatedAnimated.View>
          ) : (
            <View style={{ zIndex: 10 }}>{children}</View>
          )}
        </View>
      </Modal>
    </SheetContext.Provider>
  );
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  if (Platform.OS === 'web') {
    return (
      <WebSheet open={open} onOpenChange={onOpenChange}>
        {children}
      </WebSheet>
    );
  }

  return (
    <NativeSheet open={open} onOpenChange={onOpenChange}>
      {children}
    </NativeSheet>
  );
}

interface SheetContentProps {
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function SheetContent({ children, className, style }: SheetContentProps) {
  const { colorScheme } = useTheme();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();

  return (
    <View
      style={StyleSheet.flatten([
        {
          maxHeight: height * 0.85,
          height: Math.min(height * 0.75, 650),
          width: '100%',
          backgroundColor: colorScheme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)',
          paddingBottom: Math.max(insets.bottom, 16),
          marginBottom: width < 768 ? 0 : undefined, // Force 0 on mobile to prevent floating
        },
        style,
      ])}
      className={cn(
        'rounded-t-3xl shadow-2xl md:max-w-2xl md:mx-auto md:rounded-3xl md:mb-6 border-t border-border overflow-hidden p-6',
        colorScheme === 'dark' ? 'dark' : '',
        className
      )}>
      <View className="flex-1">{children}</View>
    </View>
  );
}

export function SheetHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <View className={cn('mb-4', className)}>{children}</View>;
}

export function SheetTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <View className={cn('', className)}>{children}</View>;
}

export function SheetDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <View className={cn('', className)}>{children}</View>;
}
