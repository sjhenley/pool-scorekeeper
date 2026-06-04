import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { cssInterop } from 'nativewind';
import { ComponentProps } from 'react';

export const StyledMaterialIcon = ({
  ...props
}: ComponentProps<typeof MaterialIcons>) => {
  const StyledMaterialIcons = cssInterop(MaterialIcons, { className: 'style' });
  return (
    <StyledMaterialIcons {...props} />
  );
};
