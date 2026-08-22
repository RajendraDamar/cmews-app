import { cn } from '~/lib/utils';
import * as SwitchPrimitives from '@rn-primitives/switch';
import { Platform } from 'react-native';

import { useTheme } from '~/lib/theme-provider';

function Switch({
  className,
  style,
  ...props
}: SwitchPrimitives.RootProps & React.RefAttributes<SwitchPrimitives.RootRef>) {
  const { colorScheme } = useTheme();

  return (
    <SwitchPrimitives.Root
      className={cn(
        'flex h-[1.25rem] w-9 shrink-0 flex-row items-center rounded-full border border-transparent shadow-sm shadow-black/5',
        Platform.select({
          web: 'peer inline-flex outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed',
        }),
        props.checked ? 'bg-primary' : 'bg-input dark:bg-input/80',
        props.disabled && 'opacity-50',
        className
      )}
      style={(state) => {
        const userStyle = typeof style === 'function' ? style(state) : style;
        if (Platform.OS === 'web') return userStyle;
        return [
          {
            backgroundColor: props.checked
              ? colorScheme === 'dark'
                ? '#2563eb'
                : '#3b82f6'
              : colorScheme === 'dark'
                ? 'hsl(217.2 32.6% 25%)'
                : 'hsl(214.3 31.8% 85%)',
          },
          userStyle,
        ];
      }}
      {...props}>
      <SwitchPrimitives.Thumb
        className={cn(
          'size-4 rounded-full bg-background web:transition-transform',
          Platform.select({
            web: 'pointer-events-none block ring-0',
          }),
          props.checked
            ? 'translate-x-4 dark:bg-primary-foreground'
            : 'translate-x-0.5 dark:bg-foreground'
        )}
        style={
          Platform.OS !== 'web'
            ? [
                {
                  backgroundColor: '#ffffff',
                },
              ]
            : undefined
        }
      />
    </SwitchPrimitives.Root>
  );
}

export { Switch };
