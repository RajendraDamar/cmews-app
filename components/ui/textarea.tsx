// Textarea Component
import * as React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { cn } from '~/lib/utils';
import { useTheme } from '~/lib/theme-provider';

interface TextareaProps extends TextInputProps {
  className?: string;
}

export const Textarea = React.forwardRef<TextInput, TextareaProps>(
  ({ className, ...props }, ref) => {
    const { colorScheme } = useTheme();

    return (
      <TextInput
        ref={ref}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        className={cn(
          'rounded-md border border-input bg-background px-3 py-2 text-base',
          colorScheme === 'dark' ? 'text-foreground' : 'text-foreground',
          className
        )}
        placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
