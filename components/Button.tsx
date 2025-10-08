import { forwardRef } from 'react';
import { TouchableOpacityProps, View } from 'react-native';
import { Button as UIButton } from './ui/button';

type ButtonProps = {
  title: string;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(({ title, ...props }, ref) => {
  return (
    <UIButton
      ref={ref}
      label={title}
      className={props.className}
      onPress={props.onPress}
      disabled={props.disabled}
    />
  );
});

Button.displayName = 'Button';
