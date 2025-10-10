// Select Component (simple implementation using Picker-like approach)
import * as React from 'react';
import { Pressable, View, Modal, FlatList } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { Text } from './text';
import { cn } from '~/lib/utils';
import { useTheme } from '~/lib/theme-provider';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

interface SelectItemProps {
  value: string;
  label: string;
}

const SelectContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
  items: SelectItemProps[];
  setItems: React.Dispatch<React.SetStateAction<SelectItemProps[]>>;
}>({
  value: '',
  onValueChange: () => {},
  items: [],
  setItems: () => {},
});

export function Select({
  value,
  onValueChange,
  children,
  placeholder,
  disabled,
  className,
}: SelectProps) {
  const { colorScheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const [items, setItems] = React.useState<SelectItemProps[]>([]);

  const selectedItem = items.find((item) => item.value === value);

  return (
    <SelectContext.Provider value={{ value, onValueChange, items, setItems }}>
      <Pressable
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={cn(
          'flex-row items-center justify-between rounded-md border border-input bg-background px-3 py-2',
          disabled && 'opacity-50',
          className
        )}>
        <Text className={!selectedItem ? 'text-muted-foreground' : ''}>
          {selectedItem?.label || placeholder || 'Pilih...'}
        </Text>
        <ChevronDown size={16} color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}>
        <Pressable className="flex-1 justify-center bg-black/50" onPress={() => setIsOpen(false)}>
          <View
            className={cn(
              'mx-4 rounded-lg p-2',
              colorScheme === 'dark' ? 'bg-card' : 'bg-background'
            )}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onValueChange(item.value);
                    setIsOpen(false);
                  }}
                  className={cn('rounded-md px-4 py-3', item.value === value && 'bg-primary/10')}>
                  <Text className={item.value === value ? 'font-medium' : ''}>{item.label}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>

      {children}
    </SelectContext.Provider>
  );
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  const { setItems } = React.useContext(SelectContext);
  const label = typeof children === 'string' ? children : value;

  React.useEffect(() => {
    setItems((prev: SelectItemProps[]) => {
      const exists = prev.find((item: SelectItemProps) => item.value === value);
      if (exists) return prev;
      return [...prev, { value, label }];
    });
  }, [value, label, setItems]);

  return null;
}

export function SelectTrigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return null;
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  return null;
}
