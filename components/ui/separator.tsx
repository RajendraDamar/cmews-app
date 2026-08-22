import * as React from 'react';
import { View } from 'react-native';
import { cn } from '~/utils/cn';

import { Platform } from 'react-native';
import { useTheme } from '~/lib/theme-provider';

const Separator = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    orientation?: 'horizontal' | 'vertical';
  }
>(({ className, orientation = 'horizontal', style, ...props }, ref) => {
  const { colorScheme } = useTheme();

  return (
    <View
      ref={ref}
      className={cn(
        'bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      style={
        Platform.OS !== 'web'
          ? [
              {
                backgroundColor:
                  colorScheme === 'dark' ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(214.3 31.8% 91.4%)',
              },
              style,
            ]
          : style
      }
      {...props}
    />
  );
});

Separator.displayName = 'Separator';

export { Separator };
