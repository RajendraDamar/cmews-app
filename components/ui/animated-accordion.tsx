import React, { useState } from 'react';
import { View, Pressable, Platform, LayoutAnimation } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { Text } from '~/components/ui/text';
import { useTheme } from '~/lib/theme-provider';
import { getThemeColor } from '~/lib/constants';
import { cn } from '~/lib/utils';
import * as Haptics from 'expo-haptics';

interface AnimatedAccordionProps {
  /** Accordion Header Title */
  title: string;
  /** Leading Icon Component */
  icon?: React.ComponentType<{ size: number; color: string }>;
  /** Custom Icon Color */
  iconColor?: string;
  /** Right accessory (e.g. badge or subtitle) */
  badge?: React.ReactNode;
  /** Default expanded state */
  defaultOpen?: boolean;
  /** Controlled open state */
  isOpen?: boolean;
  /** Toggle callback */
  onToggle?: (open: boolean) => void;
  /** Children content */
  children: React.ReactNode;
  /** Custom root className */
  className?: string;
  /** Custom header className */
  headerClassName?: string;
  /** Custom content container className */
  contentClassName?: string;
  /** Enable haptic feedback on mobile */
  haptics?: boolean;
}

export function AnimatedAccordion({
  title,
  icon: Icon,
  iconColor,
  badge,
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onToggle,
  children,
  className,
  headerClassName,
  contentClassName,
  haptics = true,
}: AnimatedAccordionProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledIsOpen !== undefined;
  const open = isControlled ? controlledIsOpen : internalOpen;

  const { colorScheme } = useTheme();
  const themeColors = getThemeColor(colorScheme === 'dark');

  const handleToggle = () => {
    if (haptics && Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Haptics safe fallback
      }
    }

    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    const nextState = !open;
    if (!isControlled) {
      setInternalOpen(nextState);
    }
    onToggle?.(nextState);
  };

  return (
    <View className={cn('mb-2 overflow-hidden rounded-lg', className)}>
      {/* Header Trigger */}
      <Pressable
        onPress={handleToggle}
        className={cn(
          'flex-row items-center justify-between rounded-lg bg-muted/80 p-4 active:bg-muted/90 web:transition-colors web:duration-200',
          headerClassName
        )}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={title}>
        <View className="flex-1 flex-row items-center gap-3">
          {Icon && (
            <Icon size={20} color={iconColor || themeColors.primary} />
          )}
          <Text className="font-semibold">{title}</Text>
        </View>

        <View className="flex-row items-center gap-2">
          {badge}
          <View
            className={cn(
              'items-center justify-center web:transition-transform web:duration-300 web:ease-out'
            )}
            style={{
              transform: [{ rotate: open ? '180deg' : '0deg' }],
            }}>
            <ChevronDown size={20} color={themeColors.muted} />
          </View>
        </View>
      </Pressable>

      {/* Expandable Content Container */}
      {Platform.OS === 'web' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateRows: open ? '1fr' : '0fr',
            transition: 'grid-template-rows 280ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
          <div style={{ minHeight: 0, overflow: 'hidden' }}>
            <View className={cn('mt-1.5 rounded-lg bg-card p-4 shadow-sm', contentClassName)}>
              {children}
            </View>
          </div>
        </div>
      ) : (
        open && (
          <View className={cn('mt-1.5 rounded-lg bg-card p-4 shadow-sm', contentClassName)}>
            {children}
          </View>
        )
      )}
    </View>
  );
}
