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
        <Button primary onPress={() => router.navigate('/storybook')} label="Go to Storybook" />
        <Button
          label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
          onPress={() => setColorScheme(currentTheme === 'dark' ? 'light' : 'dark')}
        />
      </View>
    </LinearGradient>
  );
}
