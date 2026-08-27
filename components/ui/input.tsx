import * as React from 'react';
import { TextInput , Platform } from 'react-native';
import { cn } from '~/lib/utils';


import { useTheme } from '~/lib/theme-provider';

const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  React.ComponentPropsWithoutRef<typeof TextInput>
>(({ className, placeholderClassName, style, ...props }, ref) => {
  const { colorScheme } = useTheme();

  return (
    <TextInput
      ref={ref}
      className={cn(
        'h-12 rounded-md border border-input bg-background px-3 text-base text-foreground file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground web:flex web:w-full web:py-2 web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
        props.editable === false && 'opacity-50 web:cursor-not-allowed',
        className
      )}
      placeholderTextColor={
        props.placeholderTextColor || (colorScheme === 'dark' ? '#9ca3af' : '#6b7280')
      }
      placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
      style={
        Platform.OS !== 'web'
          ? [
              {
                backgroundColor: colorScheme === 'dark' ? '#0b1329' : '#ffffff',
                borderColor:
                  colorScheme === 'dark' ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(214.3 31.8% 91.4%)',
                color: colorScheme === 'dark' ? '#f3f4f6' : '#1f2937',
              },
              style,
            ]
          : style
      }
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
