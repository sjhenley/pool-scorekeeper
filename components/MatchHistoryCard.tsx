import { getMatchById } from '@/dao/history.dao';
import { Match } from '@/models/match.model';
import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';

export interface MatchHistoryCardProps {
  /** Match information */
  match: Match;
}

export const MatchHistoryCard = ({ match }: MatchHistoryCardProps) => {
  const [matchDetails, setMatchDetails] = useState<Match>();

  useEffect(() => {
    async function fetchMatch(id: string) {
      const match = await getMatchById(id);
      if (match) {
        setMatchDetails(match);
      }
    }
    fetchMatch(match.matchId);
  }, [match.matchId]);
  return (
    <View className='w-full flex-row p-5 border-t border-text-500 dark:border-text-700 gap-5 items-center'>
      {/* 8-Ball Icon */}
      {
        matchDetails?.gameId === 'apa-eight-ball' && (
          <View className='flex-col items-center ml-auto flex-shrink'>
            <Image source={require('../assets/balls/8.png')} className='w-12 h-12 mb-2' />
          </View>
        )
      }

      {/* 9-Ball Icon */}
      {
        matchDetails?.gameId === 'apa-nine-ball' && (
          <View className='flex-col items-center ml-auto flex-shrink'>
            <Image source={require('../assets/balls/9.png')} className='w-12 h-12 mb-2' />
          </View>
        )
      }

      {/* Player Names and Scores*/ }
      <View className='flex-col flex-grow gap-1'>
        {
          matchDetails?.players.map((player, idx) => (
            <View key={'match-history-player' + matchDetails.matchId + player.playerId + idx} className='flex-row gap-2'>
              <Text className='flex-grow font-bold text-2xl font-sans text-text-800 dark:text-text-200'>{player.playerName}</Text>
              <Text className='text-2xl font-sans text-text-800 dark:text-text-200'>{player.matchPoints}</Text>
            </View>
          ))
        }
      </View>
    </View>
  );
};
