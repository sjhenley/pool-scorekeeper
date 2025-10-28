import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button } from './Button';
import React from 'react';
import { StyledMaterialIcon } from './StyledMaterialIcon';

export interface SelectionOption<T> {
  label: string;
  value: T;
}

export interface SelectionDialogProps<T> {
  /** Handler for selection */
  onClose: (selection?: T) => void;
  /** Dialog title */
  title: string;
  /** Options to choose from */
  options: SelectionOption<T>[];
  /** Initial selection data */
  selection?: number;
}

export const SelectionDialog = <T,>({
  onClose,
  title,
  options,
  selection
}: SelectionDialogProps<T>) => {

  const [selectedIndex, setSelectedIndex] = React.useState<number | undefined>(selection);
  return (
    <View className='flex gap-5'>
      <Text className='text-primary text-center text-3xl font-bold'>{title}</Text>
      <ScrollView className='w-full' contentContainerClassName='justify-center items-center pb-12'>
        {
          options.map((option, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <TouchableOpacity className='disabled:bg-text-300 dark:disabled:bg-background-800' disabled={isSelected} key={'option-card' + idx} onPress={() => setSelectedIndex(idx)}>
                <View className={`w-full flex-row py-5 px-3 border-b border-text-500 dark:border-text-700 gap-5 items-center ${isSelected ? 'bg-background-400' : ''}`}>
                  <StyledMaterialIcon name={isSelected ? 'radio-button-checked' : 'radio-button-unchecked'} size={22} className='text-text-800 dark:text-text-200 flex' />
                  <Text className='text-xl font-sans text-text-800 dark:text-text-200 flex-grow'>{option.label}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        }
        <View className='h-24' />
      </ScrollView>
      <View className='mt-12 flex-row gap-2'>
        <Button
          label='Cancel'
          primary={false}
          onPress={() => onClose()}
          containerClass='flex-1'
        />
        <Button
          label='Confirm'
          onPress={() => selectedIndex !== undefined && onClose(options[selectedIndex].value)}
          disabled={selectedIndex === undefined}
          containerClass='flex-1'
        />
      </View>
    </View>
  );
};
