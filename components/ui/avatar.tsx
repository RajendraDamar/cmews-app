// Avatar Component
import * as React from 'react';
import { View, Image } from 'react-native';
import { Text } from './text';
import { cn } from '~/lib/utils';

interface AvatarProps {
  className?: string;
  children: React.ReactNode;
}

export function Avatar({ className, children }: AvatarProps) {
  return (
    <View className={cn('h-10 w-10 items-center justify-center rounded-full bg-muted', className)}>
      {children}
    </View>
  );
}

interface AvatarImageProps {
  source: { uri: string };
  className?: string;
}

export function AvatarImage({ source, className }: AvatarImageProps) {
  return <Image source={source} className={cn('h-full w-full rounded-full', className)} />;
}

interface AvatarFallbackProps {
  children: React.ReactNode;
  className?: string;
}

export function AvatarFallback({ children, className }: AvatarFallbackProps) {
  return (
    <View className={cn('h-full w-full items-center justify-center', className)}>
      <Text className="font-medium">{children}</Text>
    </View>
  );
}
