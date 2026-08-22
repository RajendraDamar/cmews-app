import { TextClassContext } from '~/components/ui/text';
import { cn } from '~/lib/utils';
import * as TabsPrimitive from '@rn-primitives/tabs';
import { Platform } from 'react-native';
import { useTheme } from '~/lib/theme-provider';

function Tabs({
  className,
  ...props
}: TabsPrimitive.RootProps & React.RefAttributes<TabsPrimitive.RootRef>) {
  return <TabsPrimitive.Root className={cn('flex flex-col gap-2', className)} {...props} />;
}

function TabsList({
  className,
  style,
  ...props
}: TabsPrimitive.ListProps & React.RefAttributes<TabsPrimitive.ListRef>) {
  const { colorScheme } = useTheme();

  return (
    <TabsPrimitive.List
      className={cn(
        'flex h-9 flex-row items-center justify-center rounded-lg bg-muted p-[3px]',
        className
      )}
      style={
        Platform.OS !== 'web'
          ? [
              {
                backgroundColor:
                  colorScheme === 'dark' ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(210 40% 96.1%)',
              },
              style,
            ]
          : style
      }
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  style,
  ...props
}: TabsPrimitive.TriggerProps & React.RefAttributes<TabsPrimitive.TriggerRef>) {
  const { value } = TabsPrimitive.useRootContext();
  const { colorScheme } = useTheme();
  const isActive = value === props.value;

  return (
    <TextClassContext.Provider
      value={cn(
        'text-sm font-medium',
        isActive ? 'text-foreground font-semibold' : 'text-muted-foreground'
      )}>
      <TabsPrimitive.Trigger
        className={cn(
          'flex h-[calc(100%-1px)] flex-row items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 shadow-none shadow-black/5',
          Platform.select({
            web: 'inline-flex cursor-default whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0',
          }),
          props.disabled && 'opacity-50',
          isActive && 'bg-background shadow-sm dark:border-foreground/10 dark:bg-input/30',
          className
        )}
        style={(state) => {
          const userStyle = typeof style === 'function' ? style(state) : style;
          if (Platform.OS === 'web') return userStyle;
          return [
            {
              backgroundColor: isActive
                ? colorScheme === 'dark'
                  ? '#0b1329'
                  : '#ffffff'
                : 'transparent',
            },
            userStyle,
          ];
        }}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function TabsContent({
  className,
  ...props
}: TabsPrimitive.ContentProps & React.RefAttributes<TabsPrimitive.ContentRef>) {
  return (
    <TabsPrimitive.Content
      className={cn(Platform.select({ web: 'flex-1 outline-none' }), className)}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
