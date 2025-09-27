import { ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import { useRouter, useFocusEffect, useGlobalSearchParams, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { getPlayerById, getPlayers, putPlayer } from '@/dao/player.dao';
import Player from '@/models/player';
import { Button, Dialog, PlayerCard, PlayerDialog } from '@/components';
import { GAME_CONFIG, GameConfig } from '@/const/game-config';

function isPlayerSelected(player: Player, stagedPlayers?: string) {
  if (!stagedPlayers) return false;
  const stagedPlayerIds: string[] = JSON.parse(stagedPlayers);
  return stagedPlayerIds.includes(player.id);
}

export default function NewGame() {
  const [players, setPlayers] = useState<Player[]>([]);

  const [gameConfig, setGameConfig] = useState<GameConfig>();
  const [selectedPlayer, setSelectedPlayer] = useState<Player>();

  const { gameId: localId, players: stagedPlayers } = useLocalSearchParams<{ gameId: string, players: string }>();

  const navigation = useNavigation();
  const router = useRouter();

  console.log('localId ', localId);
  console.log('localPlayers ', stagedPlayers);

  useEffect(() => {
    // Find the game config based on the localId
    const gameConfig = GAME_CONFIG.find(config => config.id === localId);
    if (!gameConfig) {
      console.error('No matching game config found for id: ', localId);
      return;
    }

    setGameConfig(gameConfig);
    navigation.setOptions({ title: 'Player Select' });

  }, [localId, navigation, players]);

  // Refresh player list whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      async function fetchPlayers() {
        const loadedPlayers = await getPlayers();
        if (isActive) setPlayers(loadedPlayers);
      }
      fetchPlayers();
      return () => { isActive = false; };
    }, [])
  );

  /**
   * Stages a player to be in the next match
   * @param player Player to be added to the match
   */
  function onConfirmPlayer() {
    if (!selectedPlayer) return;
    const selectedPlayers = [selectedPlayer?.id];
    if (stagedPlayers) {
      selectedPlayers.push(...JSON.parse(stagedPlayers));
    }
    setSelectedPlayer(undefined);
    router.navigate({
      pathname: '/new-game',
      params: {
        gameId: localId,
        players: JSON.stringify(selectedPlayers)
      }
    });
  }

  return (
    <View className='flex-1 flex-col justify-center items-center bg-text-300 dark:bg-background-900 gap-5 p-5'>
      {gameConfig && (
        <View className='border-b border-text-500 dark:border-text-700 w-full'>
          <Text className='text-primary text-4xl font-bold mb-8 text-center' >{gameConfig.name}</Text>
          <Text className='text-primary text-2xl font-bold mb-8 text-center' >{gameConfig.description}</Text>
        </View>
      )}
      <ScrollView className='w-full' contentContainerClassName='justify-center items-center pb-12'>
        {
          players.map((player, idx) => (
            <TouchableOpacity className='disabled:bg-text-300 dark:disabled:bg-background-800' disabled={isPlayerSelected(player, stagedPlayers)} key={'player-card' + player.id + idx} onPress={() => setSelectedPlayer(player)}>
              <View className={`w-full flex-row p-3 border-b border-text-500 dark:border-text-700 gap-5 items-center  ${player.id === selectedPlayer?.id ? 'bg-background-400' : ''}`}>
                <Text className='text-4xl font-sans font-bold text-text-800 dark:text-text-200 mb-2 flex-grow'>{player.name}</Text>
                {
                  gameConfig?.id === 'apa-eight-ball' && (
                    <View className='flex-col items-center ml-auto flex-shrink'>
                      <Image source={require('../assets/balls/8.png')} className='size-8 mb-2' />
                      <Text className='text-2xl font-sans text-text-800 dark:text-text-200'>SR {player.skill8}</Text>
                    </View>
                  )
                }
                {
                  gameConfig?.id === 'apa-nine-ball' && (
                    <View className='flex-col items-center ml-auto flex-shrink'>
                      <Image source={require('../assets/balls/9.png')} className='size-8 mb-2' />
                      <Text className='text-2xl font-sans text-text-800 dark:text-text-200'>SR {player.skill9}</Text>
                    </View>
                  )
                }
              </View>
            </TouchableOpacity>
          ))
        }
        <View className='h-24' />
      </ScrollView>
      <View className='w-full pb-4 border-t border-text-500 dark:border-text-700'>
        <Button label={'Select Player ' + ((stagedPlayers ? JSON.parse(stagedPlayers).length : 0) + 1)} size='lg' containerClass='w-full' onPress={onConfirmPlayer} />
      </View>
    </View>
  );
}
