import { Text, View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { getPlayerById, putPlayer, deletePlayer } from '@/dao/player.dao';
import Player from '@/models/player';
import { Button, ConfirmDialog, Dialog, PlayerDialog } from '@/components';

export default function UserProfile() {
  const [profile, setProfile] = useState<Player>();
  const [dialogVisible, setDialogVisible] = useState<'update-player' | 'confirm-delete' | ''>('');

  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchPlayer(id: string) {
      const player = await getPlayerById(id);
      if (player) {
        setProfile(player);
        navigation.setOptions({ title: player.name });
      }
    }
    fetchPlayer(id);
  }, [navigation, id]);

  async function onUpdatePlayer(player?: Player): Promise<void> {
    if (player) {
      await putPlayer(player);
      setProfile(player);
      navigation.setOptions({ title: player.name });
    }
    setDialogVisible('');
  }

  async function onDeletePlayerConfirm(confirmed: boolean): Promise<void> {
    setDialogVisible('');
    if (confirmed && profile) {
      console.debug('deleting player ', profile.id);
      await deletePlayer(profile.id);
      navigation.goBack();
    }
  }

  return (
    <View className='w-full h-full'>
      <Dialog
        isOpen={dialogVisible === 'update-player'}
        onClose={() => setDialogVisible('')}
      >
        <PlayerDialog player={profile} onClose={onUpdatePlayer} />
      </Dialog>
      <Dialog
        isOpen={dialogVisible === 'confirm-delete'}
        onClose={() => setDialogVisible('')}
      >
        <ConfirmDialog
          onClose={onDeletePlayerConfirm}
          header='Delete Player'
          message='Are you sure you want to delete this player? This action cannot be undone.'
        />
      </Dialog>
      <View className='flex-1 flex-col justify-center items-center bg-text-300 dark:bg-background-900 gap-5 p-5'>
        <Text className='text-primary text-4xl font-bold mb-8 text-center' >User: {profile?.name}</Text>
        <Button
          primary
          size='lg'
          label="Edit Player"
          containerClass='w-full px-5 self-end flex-grow-1 w-full'
          onPress={() => setDialogVisible('update-player')}
        />
        <Button
          primary={false}
          size='lg'
          label="Delete Player"
          containerClass='w-full px-5 self-end flex-grow-1 w-full'
          onPress={() => setDialogVisible('confirm-delete')}
        />
      </View>
    </View>
  );
}
