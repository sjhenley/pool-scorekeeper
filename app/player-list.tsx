import { useRouter } from 'expo-router';
import { Button, Dialog, NewPlayerDialog } from '@/components';
import { PlayerCard } from '@/components/PlayerCard';
import Player from '@/models/player';
import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { getPlayers, putPlayer } from '@/dao/player.dao';

export default function PlayerList() {
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [newPlayerDialogShown, setNewPlayerDialogShown] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    async function fetchPlayers() {
      const loadedPlayers = await getPlayers();
      setPlayers(loadedPlayers);
    }
    fetchPlayers();
  }, [newPlayerDialogShown]);

  async function onCreatePlayer(player?: Player): Promise<void> {
    if (player) {
      await putPlayer(player);
    }
    setNewPlayerDialogShown(false);
  }

  return (
    <View className='w-full h-full'>
      <Dialog
        isOpen={newPlayerDialogShown}
        onClose={() => setNewPlayerDialogShown(false)}
      >
        <NewPlayerDialog onClose={onCreatePlayer} />
      </Dialog>
      <View className='flex-1 justify-center items-center bg-text-300 dark:bg-background-900 gap-5 pt-5'>

        <Button
          primary
          transparent
          size='md'
          icon='add'
          label="New Player"
          containerClass='w-full'
          onPress={() => setNewPlayerDialogShown(true)}
        />
        <ScrollView className='w-full'>
          {
            players.map((player, idx) => (
              <TouchableOpacity key={'player-card' + player.id + idx} onPress={() => router.push(`/profile/${player.id}` as any)}>
                <PlayerCard player={player} />
              </TouchableOpacity>
            ))
          }
        </ScrollView>
      </View>
    </View>

  );
}
