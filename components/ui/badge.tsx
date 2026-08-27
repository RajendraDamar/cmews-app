import * as React from 'react';
import { View, Platform } from 'react-native';
import { Text } from '~/components/ui/text';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~/lib/utils';
import { useTheme } from '~/lib/theme-provider';

const badgeVariants = cva('items-center rounded-full border flex-row px-2.5 py-0.5', {
  variants: {
    variant: {
      default: 'border-transparent bg-primary',
      secondary: 'border-transparent bg-secondary',
      destructive: 'border-transparent bg-destructive',
      outline: 'bg-transparent border-input',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const badgeTextVariants = cva('text-xs font-semibold', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive-foreground',
      outline: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface BadgeProps
  extends React.ComponentPropsWithoutRef<typeof View>,
    VariantProps<typeof badgeVariants> {
  label: string;
  labelClasses?: string;
}

const Badge = React.forwardRef<React.ElementRef<typeof View>, BadgeProps>(
  ({ className, variant, label, labelClasses, style, ...props }, ref) => {
    const { colorScheme } = useTheme();
    const isDark = colorScheme === 'dark';

    return (
      <View
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        style={
          Platform.OS !== 'web' && variant === 'outline'
            ? [{ borderColor: isDark ? 'hsl(217.2 32.6% 25%)' : 'hsl(214.3 31.8% 85%)' }, style]
            : style
        }
        {...props}>
        <Text
          className={cn(badgeTextVariants({ variant }), labelClasses)}
          style={
            Platform.OS !== 'web' && variant === 'outline'
              ? { color: isDark ? '#f8fafc' : '#0f172a' }
              : undefined
          }>
          {label}
        </Text>
      </View>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants, badgeTextVariants };
