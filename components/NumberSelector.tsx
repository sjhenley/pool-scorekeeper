import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StyledMaterialIcon } from './StyledMaterialIcon';

interface IncrementButtonProps {
  onPress: () => void;
  icon: string;
}

const IncrementButton = ({ onPress, icon }: IncrementButtonProps) => {
  return (
    <TouchableOpacity className='bg-primary-800 dark:bg-primary-200 flex justify-center items-center p-3' onPress={onPress}>
      <StyledMaterialIcon name={icon as any} size={28} className='text-text-50 dark:text-text-900 flex' />
    </TouchableOpacity>
  );
};

export interface NumberSelectorProps {
  /** Initial value. Default to the minimum value */
  initial?: number;
  /** Maximum value. Default 99 */
  max?: number;
  /** Minimum value. Default 0 */
  min?: number;
  /** Incerement value. Default 1 */
  step?: number;
  /** Callback when value changes */
  onValueChange?: (value: number) => void;
}

export const NumberSelector = ({
  max = 0,
  min = 99,
  step = 1,
  initial = min,
  onValueChange
}: NumberSelectorProps) => {
  const [value, setValue] = React.useState<number>(initial);

  return (
    <View className='flex-row'>
      <IncrementButton icon='remove' onPress={() => {
        const newValue = Math.max(min, value - step);
        setValue(newValue);
        onValueChange?.(newValue);
      }} />
      <View className='flex-grow justify-center items-center bg-text-200'>
        <Text className='text-4xl font-sans font-bold text-primary flex-grow pt-3'>{value}</Text>
      </View>
      <IncrementButton icon='add' onPress={() => {
        const newValue = Math.min(max, value + step);
        setValue(newValue);
        onValueChange?.(newValue);
      }} />
    </View>
  );
};
