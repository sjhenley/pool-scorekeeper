import { Text, TouchableOpacity, View } from 'react-native';

export interface ButtonProps {
  /** Button contents */
  label: string;
  /** Primary button style */
  primary?: boolean;
  /** Transparent button style */
  transparent?: boolean;
  /** Optional click handler */
  onPress?: () => void;
}

/** Primary UI component for user interaction */
export const Button = ({
  label,
  primary = true,
  transparent = false,
  onPress
}: ButtonProps) => {
  const containerColorConfig = {
    primary: {
      filled: 'bg-primary-800 dark:bg-primary-200 shadow-md shadow-background-900 dark:shadow-background-500',
      transparent: 'border border-2 border-primary-800 dark:border-primary-200'
    },
    secondary: {
      filled: 'bg-secondary-300 dark:bg-secondary-600 shadow-md shadow-background-900 dark:shadow-background-500',
      transparent: 'border border-2 border-secondary-300 dark:border-secondary-600'
    }
  };

  const textColorConfig = {
    primary: {
      filled: 'text-text-200 dark:text-text-900',
      transparent: 'text-primary-800 dark:text-primary-200'
    },
    secondary: {
      filled: 'text-text-900 dark:text-text-200',
      transparent: 'text-secondary-300 dark:text-secondary-600'
    }
  };
  const primaryMapper = primary ? 'primary' : 'secondary';
  const styleType = transparent ? 'transparent' : 'filled';

  const containerColor = containerColorConfig[primaryMapper][styleType];
  const textColor = textColorConfig[primaryMapper][styleType];

  return (
    <TouchableOpacity className={`${containerColor} p-5 items-center w-full rounded-xl`} accessibilityRole="button" activeOpacity={0.6} onPress={onPress}>
      <View>
        <Text className={`${textColor} font-sans text-2xl`}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};
