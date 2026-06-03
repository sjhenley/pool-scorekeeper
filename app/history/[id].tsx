import { Text, View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { deleteMatchById, getMatchById } from '@/dao/history.dao';
import { Button, ConfirmDialog, Dialog } from '@/components';
import { Match } from '@/models/match.model';
import { GAME_CONFIG } from '@/const/game-config';

export default function MatchHistory() {
  const [dialogVisible, setDialogVisible] = useState<'confirm-delete' | ''>('');
  const [matchDetails, setMatchDetails] = useState<Match>();
  const [matchDate, setMatchDate] = useState<string>();
  const [pointsEarnedLabel, setPointsEarnedLabel] = useState<string>();

  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  /**
   * Match initialization
   */
  useEffect(() => {
    async function fetchMatch(id: string) {
      const match = await getMatchById(id);
      if (match) {
        setMatchDetails(match);

        // Get the game name from the game config for display in the header
        const gameConfig = GAME_CONFIG.find(game => game.id === match.gameId);
        navigation.setOptions({ title: gameConfig?.name || match.gameId });

        try {
          // Try to parse the date and format it for display
          const date = new Date(match.date);
          setMatchDate(date.toLocaleString());
        } catch (error) {
          console.error('Error parsing date:', error);
          setMatchDate(match.date); // Fallback to raw date string if parsing fails
        }
        // Set points earned label based on game type
        if (match.gameId === 'apa-eight-ball') {
          setPointsEarnedLabel('Rack Points');
        } else if (match.gameId === 'apa-nine-ball') {
          setPointsEarnedLabel('Ball Points');
        }
      }
    }
    if (typeof id === 'string') {
      // guard against id being undefined or an array, which can happen with useLocalSearchParams
      fetchMatch(id);
    }
  }, [navigation, id]);

  async function onDeleteMatchConfirm(confirmed: boolean): Promise<void> {
    setDialogVisible('');
    if (confirmed && matchDetails) {
      console.debug('deleting match ', matchDetails.matchId);
      await deleteMatchById(matchDetails.matchId);
      navigation.goBack();
    }
  }

  return (
    <View className='bg-text-300 dark:bg-background-900 w-full h-full py-8 px-2 gap-4'>
      <Dialog
        isOpen={dialogVisible === 'confirm-delete'}
        onClose={() => setDialogVisible('')}
      >
        <ConfirmDialog
          onClose={onDeleteMatchConfirm}
          header='Delete Match'
          message='Are you sure you want to delete this match from history? This action cannot be undone.'
        />
      </Dialog>

      {/* Box Score */}
      <View className='flex-grow px-10'>
        {/* Header */}
        <View className='flex flex-row gap-5 justify-center items-center'>
          <Text className='text-primary text-2xl font-bold mb-8 text-left flex-grow' >{matchDetails?.players[0]?.playerName}</Text>
          <Text className='text-primary text-2xl font-bold mb-8 text-right flex-grow' >{matchDetails?.players[1]?.playerName}</Text>
        </View>

        {/* Match Points */}
        <View className='flex flex-row gap-5 justify-center items-center'>
          <Text className='text-primary text-2xl mb-8 text-left flex-grow'>{matchDetails?.players[0]?.matchPoints ?? 0}</Text>
          <Text className='text-primary text-2xl font-bold mb-8 text-center flex-grow' >Match Points</Text>
          <Text className='text-primary text-2xl mb-8 text-right flex-grow'>{matchDetails?.players[1]?.matchPoints ?? 0}</Text>
        </View>

        {/* Game Points (9-ball only) */}
        <View className='flex flex-row gap-5 justify-center items-center'>
          <Text className='text-primary text-2xl mb-8 text-left flex-grow'>{matchDetails?.players[0]?.points}</Text>
          <Text className='text-primary text-2xl font-bold mb-8 text-center flex-grow'>{pointsEarnedLabel}</Text>
          <Text className='text-primary text-2xl mb-8 text-right flex-grow'>{matchDetails?.players[1]?.points}</Text>
        </View>
      </View>

      {/* Match Details */}
      <View>
        <Text className='text-primary text-xl text-center' >{matchDetails?.matchId}</Text>
        <Text className='text-primary text-xl text-center' >{matchDate}</Text>
      </View>
      <Button
        primary={false}
        size='lg'
        label="Delete Match"
        containerClass='mx-10 flex-grow-1'
        onPress={() => setDialogVisible('confirm-delete')}
      />
    </View>
  );
}
