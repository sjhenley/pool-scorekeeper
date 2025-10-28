import { View } from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { getPlayers } from '@/dao/player.dao';
import Player from '@/models/player';
import { PlayerSelect, GameReview } from '@/components';
import { GAME_CONFIG, GameConfig } from '@/const/game-config';

export default function NewGame() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameConfig, setGameConfig] = useState<GameConfig>();

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
   * @param stagedPlayers array of player IDs already staged
   */
  function onConfirmPlayer(stagedPlayers: string[]) {
    router.push({
      pathname: '/new-game',
      params: {
        gameId: localId,
        players: JSON.stringify(stagedPlayers)
      }
    });
  }

  function onStartGame() {
    if (!gameConfig) return;
    if (!stagedPlayers || JSON.parse(stagedPlayers).length < gameConfig.playerCount) {
      console.error('Not enough players selected to start the game');
      return;
    }

    // If all checks pass, (navigate to the game screen
    router.push({
      pathname: `/game/${gameConfig.id}` as any, // trust the route is valid based on prior checks
      params: {
        gameId: localId,
        players: stagedPlayers
      }
    });
  }

  function onCancel() {
    router.replace('/');
  }

  return (
    <View className='flex-1 flex-col justify-center items-center bg-text-300 dark:bg-background-900 gap-5 p-5'>
      {
        !gameConfig ? null : JSON.parse(stagedPlayers || '[]').length < gameConfig?.playerCount ? (
          <PlayerSelect
            gameConfig={gameConfig}
            players={players}
            stagedPlayers={stagedPlayers || ''}
            onConfirmPlayer={onConfirmPlayer}
          />
        ) : (
          <GameReview
            gameConfig={gameConfig}
            stagedPlayers={stagedPlayers || ''}
            players={players}
            onStartGame={onStartGame}
            onCancel={onCancel}
          />
        )
      }
    </View>
  );
}
