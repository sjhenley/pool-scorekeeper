import { useRouter } from 'expo-router';
import { colorScheme, cssInterop } from 'nativewind';
import { Text, TouchableOpacity, View } from 'react-native';
import { Carousel } from '@/components';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from 'react';

export default function Index() {
  const router = useRouter();

  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(colorScheme.get() || 'light');

  useEffect(() => {
    setCurrentTheme(colorScheme.get() || 'light');
  }, []);

  const StyledMaterialIcons = cssInterop(MaterialIcons, { className: 'style' });

  const gameCards = [
    { title: '8 Ball', description: 'Shoot all your group balls then pocket the 8 ball', cta: 'Play Now', image: require('../assets/balls/8.png') },
    { title: '9 Ball', description: 'Shoot balls in order from 1 to 9', cta: 'Play Now', image: require('../assets/balls/9.png') },
    { title: 'Practice', description: 'Coming Soon', iconName: 'trending-up', disabled: true },
    { title: 'Online', description: 'Coming Soon', iconName: 'cloud', disabled: true }
  ];

  return (
    <LinearGradient
      colors={
        currentTheme === 'dark'
          ? ['#a2a5c3', '#131420']
          : ['#50547c', '#a2a5c3']
      }
      start={{ x: 0.5, y: 0.2 }}
      end={{ x: 0.5, y: .4 }}
      className="justify-center items-center flex h-full">
      <Text className="flex-row text-6xl font-bold text-text-50 dark:text-text-800">Scorekeeper</Text>
      <View className='flex-row '>
        <Carousel data={gameCards} />
      </View>
      <View className='flex-col items-center gap-5'>
      </View>
      <TouchableOpacity className='absolute top-12 left-6 flex-row items-center gap-2 p-3 rounded-full' onPress={() => router.navigate('/settings')}>
        <StyledMaterialIcons name="settings" size={30} className="text-text-200 dark:text-text-900" />
      </TouchableOpacity>
    </LinearGradient>
  );
}
