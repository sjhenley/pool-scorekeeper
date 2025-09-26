import { Text, View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { getPlayerById, putPlayer } from '@/dao/player.dao';
import Player from '@/models/player';
import { Button, Dialog, PlayerDialog } from '@/components';

export default function UserProfile() {
  const [profile, setProfile] = useState<Player>();
  const [editDialogVisible, setEditDialogVisible] = useState<boolean>(false);

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
    setEditDialogVisible(false);
  }

  return (
    <View className='w-full h-full'>
      <Dialog
        isOpen={editDialogVisible}
        onClose={() => setEditDialogVisible(false)}
      >
        <PlayerDialog player={profile} onClose={onUpdatePlayer} />
      </Dialog>
      <View className='flex-1 flex-col justify-center items-center bg-text-300 dark:bg-background-900 gap-5 p-5'>
        <Text className='text-primary text-4xl font-bold mb-8 text-center' >User: {profile?.name}</Text>
        <Button
          primary
          transparent
          size='md'
          label="Edit Player"
          containerClass='w-full px-5 self-end flex-grow-1 w-full'
          onPress={() => setEditDialogVisible(true)}
        />
      </View>
    </View>
  );
}
