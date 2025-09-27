import { useRouter } from 'expo-router';
import { colorScheme } from 'nativewind';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { Button, Dialog } from '@/components';
import { clearAllPlayers, putPlayer } from '@/dao/player.dao';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { getPlayerTestData } from '@/util/test.util';

export default function Settings() {
  return (
    <View className='w-full h-full'>
      <View className='flex-1 justify-center items-center bg-text-300 dark:bg-background-900 gap-5 p-5'>
        <Text className='text-4xl font-bold text-primary mb-8'>Game</Text>
      </View>
    </View>
  );
}
