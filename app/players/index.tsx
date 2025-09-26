import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Dialog, PlayerDialog } from '@/components';
import { PlayerCard } from '@/components/PlayerCard';
import Player from '@/models/player';
import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { getPlayers, putPlayer } from '@/dao/player.dao';

export default function PlayerList() {
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [newPlayerDialogShown, setNewPlayerDialogShown] = React.useState(false);
  const router = useRouter();

  // Refresh player list whenever the new player dialog is closed
  React.useEffect(() => {
    async function fetchPlayers() {
      const loadedPlayers = await getPlayers();
      setPlayers(loadedPlayers);
    }
    fetchPlayers();
  }, [newPlayerDialogShown]);

  // Refresh player list whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      async function fetchPlayers() {
        const loadedPlayers = await getPlayers();
        if (isActive) setPlayers(loadedPlayers);
      }
      fetchPlayers();
      return () => { isActive = false; };
    }, [])
  );

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
        <PlayerDialog onClose={onCreatePlayer} />
      </Dialog>
      <View className='flex-1 justify-center items-center bg-text-300 dark:bg-background-900 gap-5'>
        <ScrollView className='w-full' contentContainerClassName='justify-center items-center pb-12'>
          {
            players.map((player, idx) => (
              <TouchableOpacity key={'player-card' + player.id + idx} onPress={() => router.push(`/players/${player.id}` as any)}>
                <PlayerCard player={player} />
              </TouchableOpacity>
            ))
          }
          <View className='h-24' /> {/* Spacer to ensure content is not hidden behind the button */}
        </ScrollView>
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 10 }} className='w-full bg-text-300 dark:bg-background-900 flex-1 items-center pb-12 pt-4 border-t border-text-500 dark:border-text-700'>
          <Button
            primary
            transparent
            size='md'
            icon='add'
            label="New Player"
            containerClass='w-full'
            onPress={() => setNewPlayerDialogShown(true)}
          />
        </View>
      </View>
    </View>

  );
}
