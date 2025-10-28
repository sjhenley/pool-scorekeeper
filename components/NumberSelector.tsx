import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StyledMaterialIcon } from './StyledMaterialIcon';

interface IncrementButtonProps {
  onPress: () => void;
  icon: string;
}

const IncrementButton = ({ onPress, icon }: IncrementButtonProps) => {
  return (
    <TouchableOpacity
      hitSlop={25}
      className='bg-primary-800 dark:bg-primary-200 flex justify-center items-center p-3'
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
    >
      <StyledMaterialIcon name={icon as any} size={34} className='text-text-50 dark:text-text-900 flex' />
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
  max = 99,
  min = 0,
  step = 1,
  initial = min,
  onValueChange
}: NumberSelectorProps) => {
  const [value, setValue] = React.useState<number>(initial);

  return (
    <View className='flex-row shadow-lg shadow-background-900 dark:shadow-background-800 rounded-md overflow-hidden bg-primary-400 m-2'>
      <IncrementButton icon='remove' onPress={() => {
        const newValue = Math.max(min, value - step);
        setValue(newValue);
        onValueChange?.(newValue);
      }} />
      <View className='flex-grow justify-center items-center bg-background-200 dark:bg-background-700'>
        <Text className='text-4xl font-sans font-bold text-primary justify-center items-center'>{value}</Text>
      </View>
      <IncrementButton icon='add' onPress={() => {
        const newValue = Math.min(max, value + step);
        setValue(newValue);
        onValueChange?.(newValue);
      }} />
    </View>
  );
};
