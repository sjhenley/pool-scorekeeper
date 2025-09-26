import Player from '@/models/player';
import React from 'react';
import { View, Text, Image } from 'react-native';

export interface PlayerCardProps {
  /** Player information to render */
  player: Player
}

export const PlayerCard = ({ player }: PlayerCardProps) => {

  return (
    <View className='w-full flex-row p-5 border-t border-text-500 dark:border-text-700 gap-5'>
      <Text className='text-4xl font-sans font-bold text-text-800 dark:text-text-200 mb-2 flex-grow'>{player.name}</Text>
      <View className='flex-col items-center ml-auto flex-shrink'>
        <Image source={require('../assets/balls/8.png')} className='w-12 h-12 mb-2' />
        <Text className='text-2xl font-sans text-text-800 dark:text-text-200'>SR {player.skill8}</Text>
      </View>
      <View className='flex-col items-center ml-auto flex-shrink'>
        <Image source={require('../assets/balls/9.png')} className='w-12 h-12 mb-2' />
        <Text className='text-2xl font-sans text-text-800 dark:text-text-200'>SR {player.skill9}</Text>
      </View>
    </View>
  );
};
