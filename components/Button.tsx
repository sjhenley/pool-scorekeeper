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
  const containerColor = primary ? 'bg-light-primary dark:bg-dark-primary' : 'bg-light-secondary dark:bg-dark-secondary';
  const textColor = primary ? 'text-light-background dark:text-dark-background' : 'text-light-text dark:text-dark-text';

  return (
    <TouchableOpacity className={`py-5 items-center w-full rounded-xl shadow-lg ${containerColor}`} accessibilityRole="button" activeOpacity={0.6} onPress={onPress}>
      <View>
        <Text className={`${textColor} font-sans text-3xl`}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};
