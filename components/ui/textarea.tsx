// Textarea Component
import * as React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { cn } from '~/lib/utils';
import { useTheme } from '~/lib/theme-provider';

interface TextareaProps extends TextInputProps {
  className?: string;
}

import { Platform } from 'react-native';

export const Textarea = React.forwardRef<TextInput, TextareaProps>(
  ({ className, style, ...props }, ref) => {
    const { colorScheme } = useTheme();

    return (
      <TextInput
        ref={ref}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        className={cn(
          'rounded-md border border-input bg-background px-3 py-2 text-base',
          className
        )}
        placeholderTextColor={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'}
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
  }
);

Textarea.displayName = 'Textarea';
