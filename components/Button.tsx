import { Text, TouchableOpacity, View } from 'react-native';
import { StyledMaterialIcon } from './StyledMaterialIcon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

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

const containerSizeConfig = {
  sm: 'w-32 p-2',
  md: 'max-w-52 p-3',
  lg: 'max-w-full p-5'
};

const textSizeConfig = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl'
};

const iconSizeConfig = {
  sm: 16,
  md: 18,
  lg: 24
};

export interface ButtonProps {
  /** Button contents */
  label: string;
  /** Primary button style */
  primary?: boolean;
  /** Transparent button style */
  transparent?: boolean;
  /** Button size */
  size?: keyof typeof containerSizeConfig;
  /** Optional Material Icon */
  icon?: typeof MaterialIcons['name'];
  /** Optional click handler */
  onPress?: () => void;
  /** Class list to apply to the button container */
  containerClass?: string;
}

/** Primary UI component for user interaction */
export const Button = ({
  label,
  primary = true,
  transparent = false,
  size = 'md',
  icon,
  onPress,
  containerClass = ''
}: ButtonProps) => {

  const primaryMapper = primary ? 'primary' : 'secondary';
  const styleType = transparent ? 'transparent' : 'filled';

  const containerColor = containerColorConfig[primaryMapper][styleType];
  const containerSize = containerSizeConfig[size];
  const textColor = textColorConfig[primaryMapper][styleType];
  const textSize = textSizeConfig[size];
  const textAlign = icon ? 'text-left' : 'text-center';
  const iconSize = iconSizeConfig[size];

  return (
    <TouchableOpacity className={`${containerClass} ${containerColor} ${containerSize} items-center rounded-xl px-2`} accessibilityRole="button" activeOpacity={0.6} onPress={onPress}>
      <View className="flex-row gap-2 items-center justify-center">
        { icon && <StyledMaterialIcon name={icon as any} size={iconSize} className={`${textColor} mb-1 flex`} /> }
        <Text className={`${textColor} ${textSize} font-sans ${textAlign} items-center flex`}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};
