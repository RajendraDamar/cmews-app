import * as React from 'react';
import { Pressable, Text } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~/utils/cn';

const buttonVariants = cva('items-center justify-center rounded-md flex-row gap-2', {
  variants: {
    variant: {
      default: 'bg-primary',
      destructive: 'bg-destructive',
      outline: 'border border-input bg-background',
      secondary: 'bg-secondary',
      ghost: '',
      link: '',
    },
    size: {
      default: 'h-12 px-4 py-2',
      sm: 'h-9 px-3',
      lg: 'h-14 px-8',
      icon: 'h-10 w-10',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const buttonTextVariants = cva('text-base font-medium', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      destructive: 'text-destructive-foreground',
      outline: 'text-foreground',
      secondary: 'text-secondary-foreground',
      ghost: 'text-foreground',
      link: 'text-primary underline',
    },
    size: {
      default: 'text-base',
      sm: 'text-sm',
      lg: 'text-lg',
      icon: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof Pressable>,
    VariantProps<typeof buttonVariants> {
  label: string;
  labelClasses?: string;
}

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({ className, variant, size, label, labelClasses, ...props }, ref) => {
    return (
      <Pressable
        className={cn(props.disabled && 'opacity-50', buttonVariants({ variant, size, className }))}
        ref={ref}
        role="button"
        {...props}>
        <Text className={cn(buttonTextVariants({ variant, size, className: labelClasses }))}>
          {label}
        </Text>
      </Pressable>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants, buttonTextVariants };
