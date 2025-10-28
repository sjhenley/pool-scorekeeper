import { Text, View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { deleteMatchById, getMatchById } from '@/dao/history.dao';
import { Button, ConfirmDialog, Dialog } from '@/components';
import { Match } from '@/models/match.model';

export default function UserProfile() {
  const [dialogVisible, setDialogVisible] = useState<'confirm-delete' | ''>('');
  const [matchDetails, setMatchDetails] = useState<Match>();

  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchMatch(id: string) {
      const player = await getMatchById(id);
      if (player) {
        setMatchDetails(player);
        navigation.setOptions({ title: 'Match Results' });
      }
    }
    fetchMatch(id);
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
    <View className='w-full h-full'>
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
      <View className='flex-1 flex-col justify-center items-center bg-text-300 dark:bg-background-900 gap-5 p-5'>
        <Text className='text-primary text-4xl font-bold mb-8 text-center' >Match: {matchDetails?.gameId}</Text>
        <Text className='text-primary text-4xl font-bold mb-8 text-center' >Date: {matchDetails?.date}</Text>
        <Text className='text-primary text-4xl font-bold mb-8 text-center' >Player 1: {matchDetails?.players[0].playerName}</Text>
        <Text className='text-primary text-4xl font-bold mb-8 text-center' >Player 1 Match Points: {matchDetails?.players[0].matchPoints}</Text>
        <Text className='text-primary text-4xl font-bold mb-8 text-center' >Player 2: {matchDetails?.players[1].playerName}</Text>
        <Text className='text-primary text-4xl font-bold mb-8 text-center' >Player 2 Match Points: {matchDetails?.players[1].matchPoints}</Text>
      </View>
      <Button
        primary={false}
        size='lg'
        label="Delete Match"
        containerClass='w-full px-5 self-end flex-grow-1 w-full'
        onPress={() => setDialogVisible('confirm-delete')}
      />
    </View>
  );
}
