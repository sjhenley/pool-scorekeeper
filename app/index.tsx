import { useRouter, useFocusEffect } from 'expo-router';
import { useColorScheme, cssInterop } from 'nativewind';
import { Text, TouchableOpacity, View, BackHandler } from 'react-native';
import { Button, Carousel } from '@/components';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { usePreferences } from '@/hooks/use-preferences';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { preferences } = usePreferences();

  const StyledMaterialIcons = cssInterop(MaterialIcons, { className: 'style' });

  const gameCards = [
    { title: '8 Ball', description: 'Shoot all your group balls then pocket the 8 ball', cta: 'Play Now', image: require('../assets/balls/8.png'), onPress: () => router.navigate({ pathname: '/new-game', params: { gameId: 'apa-eight-ball' } }) },
    { title: '9 Ball', description: 'Shoot balls in order from 1 to 9', cta: 'Play Now', image: require('../assets/balls/9.png'), onPress: () => router.navigate({ pathname: '/new-game', params: { gameId: 'apa-nine-ball' } }) },
    { title: 'Practice', description: 'Coming Soon', iconName: 'trending-up', disabled: true },
    { title: 'Online', description: 'Coming Soon', iconName: 'cloud', disabled: true }
  ];

  useFocusEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp(); // Close the app when back is pressed on home
      return true;
    });
    return () => subscription.remove();
  });

  useEffect(() => {
    console.log('Preferences changed: ', preferences);
    if (!preferences?.colorScheme) return;
    if (preferences.colorScheme === colorScheme.colorScheme) return;
    console.log('Applying color scheme from preferences: ', preferences.colorScheme);
    colorScheme.setColorScheme(preferences.colorScheme);
  }, [preferences]);

  return (
    <LinearGradient
      colors={
        colorScheme.colorScheme === 'dark'
          ? ['#a2a5c3', '#131420']
          : ['#50547c', '#a2a5c3']
      }
      start={{ x: 0.5, y: 0.2 }}
      end={{ x: 0.5, y: .4 }}
      className="justify-center items-center flex h-full">
      <Text className="flex-row text-6xl font-bold text-text-50 dark:text-text-800">Scorekeeper</Text>
      <View className='flex-row'>
        <Carousel data={gameCards} initialIndex={1} />
      </View>
      <View className='flex-col items-center gap-5 w-[60%]'>
        <Button
          primary
          transparent
          size='md'
          icon='group'
          label="Player List"
          containerClass='w-full'
          onPress={() => router.navigate('/players')}
        />
        <Button
          primary
          transparent
          size='md'
          icon='history'
          label='History'
          containerClass='w-full'
          onPress={() => router.navigate('/history')}
        />
      </View>
      <TouchableOpacity className='absolute top-12 right-6 flex-row items-center gap-2 p-3 rounded-full' onPress={() => router.navigate('/settings')}>
        <StyledMaterialIcons name="settings" size={30} className="text-text-200 dark:text-text-900" />
      </TouchableOpacity>
    </LinearGradient>
  );
}
