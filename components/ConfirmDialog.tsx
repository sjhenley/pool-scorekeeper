import { Text, View } from 'react-native';
import { Button } from './Button';

export interface ConfirmDialogProps {
  /** Dialog header */
  header?: string;
  /** Dialog message */
  message?: string;
  /** On close handler. Result is true when user confirms the action */
  onClose?: (confirmed: boolean) => void;
  /** Confirm button label */
  confirmLabel?: string;
  /** Cancel button label */
  cancelLabel?: string;
}

export const ConfirmDialog = ({
  header = '',
  message = 'Are you sure?',
  onClose = () => null,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel'
}: ConfirmDialogProps) => {
  return (
    <View className='flex gap-5'>
      {header && <Text className='text-primary text-4xl font-bold mb-8 text-center'>{header}</Text>}
      <Text className='text-primary text-2xl font-bold text-center'>{message}</Text>
      <View className='mt-12 flex-row gap-2'>
        <Button
          label={cancelLabel}
          primary={false}
          onPress={() => onClose(false)}
          containerClass='flex-1'
        />
        <Button
          label={confirmLabel}
          onPress={() => onClose(true)}
          containerClass='flex-1'
        />
      </View>
    </View>
  );
};
