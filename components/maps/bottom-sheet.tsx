import { View, Pressable, Animated, Dimensions, PanResponder } from 'react-native';
import { useRef, useState, useEffect } from 'react';
import { useTheme } from '~/lib/theme-provider';
import { cn } from '~/lib/utils';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: number[];
  initialSnap?: number;
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  snapPoints = [0.3, 0.6, 0.9],
  initialSnap = 0,
}: BottomSheetProps) {
  const { colorScheme } = useTheme();
  const { height } = Dimensions.get('window');
  const [currentSnap, setCurrentSnap] = useState(initialSnap);
  const translateY = useRef(new Animated.Value(height)).current;
  const lastGestureDy = useRef(0);

  const snapToPoint = (index: number) => {
    const point = height * (1 - snapPoints[index]);
    setCurrentSnap(index);
    Animated.spring(translateY, {
      toValue: point,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        lastGestureDy.current = 0;
      },
      onPanResponderMove: (_, gesture) => {
        const newValue = height * (1 - snapPoints[currentSnap]) + gesture.dy;
        if (newValue >= 0 && newValue <= height) {
          translateY.setValue(newValue);
        }
        lastGestureDy.current = gesture.dy;
      },
      onPanResponderRelease: (_, gesture) => {
        const velocity = gesture.vy;
        const position = height * (1 - snapPoints[currentSnap]) + gesture.dy;

        if (velocity > 0.5 || (velocity > 0 && gesture.dy > 50)) {
          // Swipe down
          if (currentSnap > 0) {
            snapToPoint(currentSnap - 1);
          } else {
            onClose();
            Animated.timing(translateY, {
              toValue: height,
              duration: 250,
              useNativeDriver: true,
            }).start();
          }
        } else if (velocity < -0.5 || (velocity < 0 && gesture.dy < -50)) {
          // Swipe up
          if (currentSnap < snapPoints.length - 1) {
            snapToPoint(currentSnap + 1);
          }
        } else {
          // Find closest snap point
          const closestSnap = snapPoints.reduce((prev, curr, idx) => {
            const prevDist = Math.abs(height * (1 - prev) - position);
            const currDist = Math.abs(height * (1 - curr) - position);
            return currDist < prevDist ? curr : prev;
          });
          const snapIndex = snapPoints.indexOf(closestSnap);
          snapToPoint(snapIndex);
        }
      },
    })
  ).current;

  useEffect(() => {
    if (isOpen) {
      snapToPoint(initialSnap);
    } else {
      Animated.timing(translateY, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <Pressable
        onPress={onClose}
        className="absolute inset-0 bg-black/50"
        style={{ zIndex: 40 }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: height,
          transform: [{ translateY }],
          zIndex: 50,
        }}
        className={cn('rounded-t-3xl', colorScheme === 'dark' ? 'bg-card' : 'bg-background')}>
        <View {...panResponder.panHandlers} className="items-center py-2">
          <View className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
        </View>
        <View className="flex-1">{children}</View>
      </Animated.View>
    </>
  );
}
