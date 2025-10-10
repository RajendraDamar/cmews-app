import * as React from 'react';
import { Text as RNText } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~/utils/cn';

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
  ({ className, variant, size, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext);
    return (
      <RNText
        ref={ref}
        className={cn(textVariants({ variant, size }), textClass, className)}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';

export { Text, TextClassContext, textVariants };
