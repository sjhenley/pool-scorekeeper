import { Pressable, Text, View, Image, ImageSourcePropType } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { cssInterop } from 'nativewind';

export interface CardProps {
  /** Card Title */
  title: string;
  image: ImageSourcePropType;
  description: string;
  cta: string;
  /** Toggle for pressable function */
  disabled?: boolean;
  /** Optional click handler */
  onPress?: () => void;
}

/** Primary UI component for user interaction */
export const Card = ({
  title,
  image,
  description,
  cta,
  disabled = false,
  onPress
}: CardProps) => {
  const StyledIonicons = cssInterop(Ionicons, { className: 'style' });
  return (
    <Pressable disabled={disabled} className='bg-primary-800 dark:bg-primary-200 shadow-xl shadow-background-900 dark:shadow-background-200 py-5 w-64 h-80 items-center rounded-xl active:scale-95' accessibilityRole="button" onPress={onPress}>
      <View className="flex-1 justify-around items-center gap-3 px-3">
        <Text className='text-text-200 dark:text-text-900 font-sans font-bold text-3xl'>{title}</Text>
        <Image source={require('../assets/balls/8.png')} className='size-24' />
        <Text className='text-text-200 dark:text-text-900 font-sans text-lg text-center'>{description}</Text>
        <View className="flex-row items-center">
          <StyledIonicons name="chevron-forward" size={24} className="text-text-200 dark:text-text-900" />
          <Text className='text-text-200 dark:text-text-900 font-sans text-lg font-bold'>{cta}</Text>
        </View>

      </View>
    </Pressable>
  );
};
