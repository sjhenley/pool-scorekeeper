import { useRouter } from 'expo-router';
import { colorScheme } from 'nativewind';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Carousel } from '@/components';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
  const router = useRouter();
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  const setColorScheme = (scheme: 'light' | 'dark') => {
    colorScheme.set(scheme);
    setCurrentTheme(scheme);
  };

  const gameCards = [
    { title: '8 Ball', description: 'Shoot all your group balls then pocket the 8 ball', cta: 'Play Now', image: require('../assets/balls/8.png') },
    { title: '9 Ball', description: 'Shoot balls in order from 1 to 9', cta: 'Play Now', image: require('../assets/balls/9.png') },
    { title: 'Practice', description: 'Play solo to improve your skills', cta: 'Start Practice', iconName: 'trending-up' }
  ];

  return (
    <LinearGradient
      colors={
        currentTheme === 'dark'
          ? ['#060e23', '#3a5dd9']
          : ['#50547c', '#a2a5c3']
      }
      start={{ x: 0.5, y: 0.2 }}
      end={{ x: 0.5, y: .6 }}
      className="justify-center items-center grid-rows-3 h-full">
      <Text className="grid-row text-6xl flex-3 font-sans font-bold text-text-900 dark:text-text-100">Scorekeeper</Text>
      <View className='grid-row h-1 flex-1 border-red-500 border'>
        <Carousel data={gameCards} />
      </View>
      <View className='grid-row'>
        <Button primary onPress={() => router.navigate('/storybook')} label="Go to Storybook" />
        <Button
          label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
          onPress={() => setColorScheme(currentTheme === 'dark' ? 'light' : 'dark')}
        />
      </View>
    </LinearGradient>
  );
}
