import React from 'react';
import { MotiView } from 'moti';
import { Card } from '~/components/ui/card';
import { ViewProps } from 'react-native';

interface AnimatedCardProps extends ViewProps {
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

export function AnimatedCard({ delay = 0, children, className, ...props }: AnimatedCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: 'timing',
        duration: 400,
        delay,
      }}>
      <Card className={className} {...props}>
        {children}
      </Card>
    </MotiView>
  );
}
