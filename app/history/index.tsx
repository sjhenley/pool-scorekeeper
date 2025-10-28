import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Match } from '@/models/match.model';
import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { getMatchHistory } from '@/dao/history.dao';

export default function PlayerList() {
  const [history, setHistory] = React.useState<Match[]>([]);
  const router = useRouter();

  // Refresh match list whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      async function fetchHistory() {
        const loadedHistory = await getMatchHistory();
        console.log('loadedHistory ', loadedHistory);
        if (isActive) setHistory(loadedHistory);
      }
      fetchHistory();
      return () => { isActive = false; };
    }, [])
  );

  return (
    <View className='w-full h-full'>
      <View className='flex-1 justify-center items-center bg-text-300 dark:bg-background-900 gap-5'>
        <ScrollView className='w-full' contentContainerClassName='justify-center items-center pb-12'>
          {
            history.map((match, idx) => (
              <TouchableOpacity key={'match-card' + match.matchId + idx} onPress={() => router.push(`/history/${match.matchId}` as any)}>
                <View className='w-full'>
                  <Text className='text-primary text-2xl'>Match: {match.matchId}</Text>
                </View>
              </TouchableOpacity>
            ))
          }
          <View className='h-24' />
        </ScrollView>
      </View>
    </View>
  );
}
