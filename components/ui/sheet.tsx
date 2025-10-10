// Sheet Component for Bottom Sheet
import * as React from 'react';
import { View, Modal, Animated, Dimensions, PanResponder } from 'react-native';
import { cn } from '~/lib/utils';
import { useTheme } from '~/lib/theme-provider';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}>
      {children}
    </Modal>
  );
}

interface SheetContentProps {
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function SheetContent({ children, side = 'bottom', className }: SheetContentProps) {
  const { colorScheme } = useTheme();
  const { height } = Dimensions.get('window');
  const translateY = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    Animated.spring(translateY, {
      toValue: height * 0.2,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [height, translateY]);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const newValue = height * 0.2 + gesture.dy;
        if (newValue >= height * 0.2 && newValue <= height) {
          translateY.setValue(newValue);
        }
      },
    })
  ).current;

  return (
    <View className="flex-1 justify-end bg-black/50">
      <Animated.View
        style={{ transform: [{ translateY }] }}
        className={cn(
          'rounded-t-3xl p-6',
          colorScheme === 'dark' ? 'bg-card' : 'bg-background',
          className
        )}>
        <View {...panResponder.panHandlers} className="items-center py-2">
          <View className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
        </View>
        {children}
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
