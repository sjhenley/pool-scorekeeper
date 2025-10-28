import { Text, View, Image } from 'react-native';
import Player from '@/models/player';
import { Button } from '@/components';
import { GameConfig } from '@/const/game-config';

export interface GameReviewProps {
  /* The configuration of the game being reviewed */
  gameConfig: GameConfig;
  /* JSON string of player IDs staged for the game */
  stagedPlayers: string;
  /* Full list of players to reference details from */
  players: Player[];
  /* Callback when the game should start */
  onStartGame: () => void;
  /* Callback when the game is cancelled */
  onCancel: () => void;
}

export const GameReview = ({
  gameConfig,
  stagedPlayers,
  players,
  onStartGame,
  onCancel
}: GameReviewProps) => {
  return (
    <View className='flex-grow w-full items-center gap-5'>
      <Text className='mt-12 text-primary text-6xl font-bold mb-8 text-center'>{gameConfig.name }</Text>
      <View className='w-full flex-grow'>
        {
          JSON.parse(stagedPlayers || '[]').map((playerId: string, idx: number) => {
            const player = players.find(p => p.id === playerId);
            if (!player) return null;
            return (
              <View key={player.id} className='w-full flex-row p-3 border-y border-text-500 dark:border-text-700 gap-5 items-center'>
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
            );
          })
        }
      </View>
      <Button label='Start Game' size='lg' containerClass='w-full' onPress={onStartGame} />
      <View className='w-full pb-4 border-t border-text-500 dark:border-text-700'>
        <Button label='Cancel' size='lg' transparent containerClass='w-full' onPress={onCancel} />
      </View>
    </View>
  );
};
