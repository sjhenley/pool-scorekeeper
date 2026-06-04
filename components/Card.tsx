import { Pressable, Text, View, Image, ImageSourcePropType } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { cssInterop } from 'nativewind';

export interface CardProps {
  /** Card Title */
  title: string;
  /** Card Description */
  description: string;
  /** Card CTA */
  cta?: string;
  /** Card Image */
  image?: ImageSourcePropType;
  /** Card Icon. Will override image if provided */
  iconName?: typeof MaterialIcons['name'];
  /** Toggle for pressable function */
  disabled?: boolean;
  /** Optional click handler */
  onPress?: () => void;
}

/** Primary UI component for user interaction */
export const Card = ({
  title,
  description,
  cta,
  image,
  iconName,
  disabled = false,
  onPress
}: CardProps) => {
  const StyledMaterialIcons = cssInterop(MaterialIcons, { className: 'style' });
  return (
    <Pressable disabled={disabled} className='bg-primary-800 dark:bg-primary-200 shadow-xl shadow-background-900 dark:shadow-background-200 py-5 w-64 h-80 items-center rounded-xl active:scale-95' accessibilityRole="button" onPress={onPress}>
      <View className="flex-1 justify-around items-center gap-3 px-3">
        <Text className='text-text-200 dark:text-text-900 font-sans font-bold text-3xl'>{title}</Text>
        { iconName && <StyledMaterialIcons name={iconName} size={80} className="text-text-200 dark:text-text-900" /> }
        { !iconName && <Image source={image} className='size-24' />}
        <Text className='text-text-200 dark:text-text-900 font-sans text-lg text-center'>{description}</Text>
        {
          cta && (
            <View className="flex-row items-center">
              <StyledMaterialIcons name="chevron-right" size={24} className="text-text-200 dark:text-text-900" />
              <Text className='text-text-200 dark:text-text-900 font-sans text-lg font-bold'>{cta}</Text>
            </View>
          )
        }
      </View>
    </Pressable>
  );
};
