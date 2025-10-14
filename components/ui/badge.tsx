import * as React from 'react';
import { View, Text } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~/lib/utils';

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
  ({ className, variant, label, labelClasses, ...props }, ref) => {
    return (
      <View ref={ref} className={cn(badgeVariants({ variant }), className)} {...props}>
        <Text className={cn(badgeTextVariants({ variant }), labelClasses)}>{label}</Text>
      </View>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants, badgeTextVariants };
