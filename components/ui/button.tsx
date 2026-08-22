import * as React from 'react';
import { Pressable, Text, Platform } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~/utils/cn';
import { useTheme } from '~/lib/theme-provider';

const buttonVariants = cva('items-center justify-center rounded-md flex-row gap-2', {
  variants: {
    variant: {
      default: 'bg-primary',
      destructive: 'bg-destructive',
      outline: 'border border-input web:bg-background',
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
      outline: 'web:text-foreground',
      secondary: 'text-secondary-foreground',
      ghost: 'web:text-foreground',
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
  ({ className, variant = 'default', size, label, labelClasses, style, ...props }, ref) => {
    const { colorScheme } = useTheme();

    const nativeThemeStyle =
      Platform.OS !== 'web'
        ? {
            backgroundColor:
              variant === 'default'
                ? colorScheme === 'dark'
                  ? 'hsl(217.2 91.2% 59.8%)'
                  : 'hsl(221.2 83.2% 53.3%)'
                : variant === 'outline'
                  ? colorScheme === 'dark'
                    ? '#1e293b'
                    : '#ffffff'
                  : undefined,
            borderColor:
              variant === 'outline'
                ? colorScheme === 'dark'
                  ? 'hsl(217.2 32.6% 17.5%)'
                  : 'hsl(214.3 31.8% 91.4%)'
                : undefined,
          }
        : undefined;

    return (
      <Pressable
        className={cn(props.disabled && 'opacity-50', buttonVariants({ variant, size, className }))}
        style={(state) => {
          const userStyle = typeof style === 'function' ? style(state) : style;
          if (Platform.OS === 'web') return userStyle;
          return [nativeThemeStyle, userStyle];
        }}
        ref={ref}
        role="button"
        {...props}>
        <Text
          className={cn(buttonTextVariants({ variant, size, className: labelClasses }))}
          style={
            Platform.OS !== 'web'
              ? [
                  {
                    color:
                      variant === 'default'
                        ? '#ffffff'
                        : variant === 'outline'
                          ? colorScheme === 'dark'
                            ? 'hsl(210 40% 98%)'
                            : 'hsl(222.2 84% 4.9%)'
                          : undefined,
                  },
                ]
              : undefined
          }>
          {label}
        </Text>
      </Pressable>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants, buttonTextVariants };
