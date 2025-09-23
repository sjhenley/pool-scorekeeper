import { Text, TouchableOpacity, View } from 'react-native';

export interface ButtonProps {
  /** Button contents */
  label: string;
  /** Primary button style */
  primary?: boolean;
  /** Optional click handler */
  onPress?: () => void;
}

/** Primary UI component for user interaction */
export const Button = ({
  label,
  primary = false,
  onPress
}: ButtonProps) => {
  const containerColor = primary ? 'bg-primary-800 dark:bg-primary-400' : 'bg-secondary-300 dark:bg-secondary-800';
  const textColor = primary ? 'text-text-200 dark:text-text-900' : 'text-text-900 dark:text-text-200';

  return (
    <TouchableOpacity className={`${containerColor} py-5 items-center w-full rounded-xl shadow-lg`} accessibilityRole="button" activeOpacity={0.6} onPress={onPress}>
      <View>
        <Text className={`${textColor} font-sans text-3xl`}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};
