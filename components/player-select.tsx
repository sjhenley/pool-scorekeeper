import { ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import { useState } from 'react';
import Player from '@/models/player';
import { Button } from '@/components';
import { GameConfig } from '@/const/game-config';

export interface PlayerSelectProps {
  /* The configuration of the game being played */
  gameConfig: GameConfig,
  /* Full list of players to choose from */
  players: Player[],
  /* JSON string of player IDs already staged for the game */
  stagedPlayers: string,
  /* Callback when players are selected */
  onConfirmPlayer: (stagedPlayers: string[]) => void
}

function isPlayerSelected(player: Player, stagedPlayers?: string) {
  if (!stagedPlayers) return false;
  const stagedPlayerIds: string[] = JSON.parse(stagedPlayers);
  return stagedPlayerIds.includes(player.id);
}

export const PlayerSelect = ({ gameConfig, players, stagedPlayers, onConfirmPlayer }: PlayerSelectProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player>();

  function onSubmit() {
    if (!selectedPlayer) return;
    const selectedPlayers = [selectedPlayer?.id];
    if (stagedPlayers) {
      selectedPlayers.push(...JSON.parse(stagedPlayers));
    }
    setSelectedPlayer(undefined);
    onConfirmPlayer(selectedPlayers);
  }

  return (
    <View className='w-full'>
      <View className='border-b border-text-500 dark:border-text-700 w-full'>
        <Text className='text-primary text-4xl font-bold mb-8 text-center' >{gameConfig.name}</Text>
        <Text className='text-primary text-2xl font-bold mb-8 text-center' >{gameConfig.description}</Text>
      </View>
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
        <Button label={'Select Player ' + ((stagedPlayers ? JSON.parse(stagedPlayers).length : 0) + 1)} size='lg' containerClass='w-full' onPress={onSubmit} />
      </View>
    </View>
  );
};
