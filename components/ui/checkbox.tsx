// Checkbox Component
import * as React from 'react';
import { Pressable } from 'react-native';
import { Check } from 'lucide-react-native';
import { cn } from '~/lib/utils';
import { useTheme } from '~/lib/theme-provider';

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export function Checkbox({ checked, onCheckedChange, className, disabled }: CheckboxProps) {
  const { colorScheme } = useTheme();

  return (
    <Pressable
      onPress={() => !disabled && onCheckedChange(!checked)}
      disabled={disabled}
      className={cn(
        'h-5 w-5 items-center justify-center rounded border-2',
        checked ? 'border-primary bg-primary' : 'border-input bg-background',
        disabled && 'opacity-50',
        className
      )}>
      {checked && <Check size={14} color={colorScheme === 'dark' ? '#fff' : '#fff'} />}
    </Pressable>
  );
}
