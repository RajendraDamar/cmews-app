import * as React from 'react';
import { Text as RNText, Platform } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~/lib/utils';
import { useTheme } from '~/lib/theme-provider';

const textVariants = cva('', {
  variants: {
    variant: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      destructive: 'text-destructive',
    },
    size: {
      default: 'text-base',
      sm: 'text-sm',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

// Context for passing className to child Text components
const TextClassContext = React.createContext<string | undefined>(undefined);

interface TextProps
  extends React.ComponentPropsWithoutRef<typeof RNText>,
    VariantProps<typeof textVariants> {}

const Text = React.forwardRef<React.ElementRef<typeof RNText>, TextProps>(
  ({ className, variant = 'default', size, style, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext);
    const { colorScheme } = useTheme();

    return (
      <RNText
        ref={ref}
        className={cn(textVariants({ variant, size }), textClass, className)}
        style={
          Platform.OS !== 'web'
            ? [
                {
                  color:
                    variant === 'default'
                      ? colorScheme === 'dark'
                        ? 'hsl(210 40% 98%)'
                        : 'hsl(222.2 84% 4.9%)'
                      : variant === 'muted'
                        ? colorScheme === 'dark'
                          ? 'hsl(215 20.2% 65.1%)'
                          : 'hsl(215.4 16.3% 46.9%)'
                        : undefined,
                },
                style,
              ]
            : style
        }
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';

export { Text, TextClassContext, textVariants };
