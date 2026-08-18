// Sheet Component for Bottom Sheet
import * as React from 'react';
import {
  View,
  Modal,
  Animated,
  useWindowDimensions,
  PanResponder,
  Pressable,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { cn } from '~/lib/utils';
import { useTheme } from '~/lib/theme-provider';

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
  onOpenChange: () => {},
});

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      <Modal
        visible={open}
        transparent
        animationType="none"
        onRequestClose={() => onOpenChange(false)}>
        {children}
      </Modal>
    </SheetContext.Provider>
  );
}

interface SheetContentProps {
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function SheetContent({ children, className, style }: SheetContentProps) {
  const { open, onOpenChange } = React.useContext(SheetContext);
  const { colorScheme } = useTheme();
  const { height } = useWindowDimensions();
  const translateY = React.useRef(new Animated.Value(height)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const animateIn = React.useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: Platform.OS !== 'web',
        tension: 65,
        friction: 10,
      }),
    ]).start();
  }, [fadeAnim, translateY]);

  const animateOut = React.useCallback(
    (callback?: () => void) => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(translateY, {
          toValue: height,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start(() => {
        if (callback) callback();
      });
    },
    [fadeAnim, height, translateY]
  );

  React.useEffect(() => {
    if (open) {
      translateY.setValue(height);
      animateIn();
    }
  }, [open, height, animateIn, translateY]);

  const handleDismiss = () => {
    animateOut(() => onOpenChange(false));
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 5,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120 || gesture.vy > 0.6) {
          handleDismiss();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: Platform.OS !== 'web',
            tension: 65,
            friction: 10,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-end',
      }}>
      {/* Dimmed Backdrop */}
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
          onPress={handleDismiss}
          style={{ flex: 1 }}
          accessibilityLabel="Tutup"
        />
      </Animated.View>

      {/* Sheet Container */}
      <Animated.View
        style={[
          {
            transform: [{ translateY }],
            maxHeight: height * 0.85,
            height: Math.min(height * 0.75, 650),
            width: '100%',
          },
          style,
        ]}
        className={cn(
          'rounded-t-3xl p-6 shadow-2xl md:max-w-2xl md:mx-auto md:rounded-3xl md:mb-6',
          colorScheme === 'dark' ? 'bg-card border-t border-border' : 'bg-background border-t border-border',
          className
        )}>
        {/* Drag Handle */}
        <View {...panResponder.panHandlers} className="-mt-2 mb-2 items-center py-2">
          <View className="h-1.5 w-16 rounded-full bg-muted-foreground/40" />
        </View>
        <View className="flex-1">{children}</View>
      </Animated.View>
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
