import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { colorScheme } from 'nativewind';
import { useState, useReducer, useCallback } from 'react';
import { View, Text } from 'react-native';
import { Button, Dialog } from '@/components';
import { clearAllPlayers, getPlayers, putPlayer } from '@/dao/player.dao';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { getPlayerTestData } from '@/util/test.util';
import Player, { SkillLevel } from '@/models/player';
import { BallStatus } from '@/models/ball-status.enum';
import { getScoreGoal } from '@/util/score.util';

interface GamePlayer {
      id: string,
      skill: SkillLevel,
      name: string
      score: number
      scoreTarget: number
}

interface GameState {
  /* List of players in the game*/
  players: GamePlayer[];
  /* ID of the player whose turn it is */
  currentPlayer: string;
  /* Number of innings played so far */
  innings: number;
  /* Status of each ball on the table */
  balls: BallStatus[];
  /* Reference to previous game state */
  prev: GameState;
}

enum GameStateAction {
  SET_PLAYERS,
  MAKE_BALL,
  DEAD_BALL,
  END_TURN,
  UNDO
}

type GameAction = { type: GameStateAction.SET_PLAYERS; players: GamePlayer[] }
  | { type: GameStateAction.MAKE_BALL; ballIndex: number }
  | { type: GameStateAction.DEAD_BALL; ballIndex: number }
  | { type: GameStateAction.END_TURN }
  | { type: GameStateAction.UNDO };


function gameStateReducer(prevState: GameState, payload: GameAction): GameState {
  console.debug('Game state update dispatched: ', payload.type);
  console.debug('Current game state: ', JSON.stringify(prevState));

  if (!prevState?.players?.length && payload.type !== GameStateAction.SET_PLAYERS) {
    // players must be set first
    console.warn('Players must be set before other actions can be performed');
    return prevState;
  } else if (payload.type === GameStateAction.UNDO) {
    if (!prevState?.prev) {
      console.warn('No previous state to undo to');
      return prevState;
    } else {
      console.info('Processing state undo action');
      return prevState.prev;
    }
  }

  // Save previous state for undo functionality
  // Deep clone previous state to avoid mutation issues
  // Note: This is not the most efficient way to handle undo, but works for now
  // For a more complex app, consider using a library like immer or redux
  const newState: GameState = { ...prevState, prev: prevState };

  const isPlayerOneTurn = prevState.currentPlayer === prevState.players[0].id;
  const activePlayer = prevState.players[isPlayerOneTurn ? 0 : 1];
  const nonActivePlayers = prevState.players.filter(p => p.id !== activePlayer.id);

  switch (payload.type) {
  case GameStateAction.SET_PLAYERS:
    newState.players = payload.players;
    newState.currentPlayer = payload.players[0].id;
    break;
  case GameStateAction.MAKE_BALL:
    newState.balls[payload.ballIndex] = isPlayerOneTurn ? BallStatus.SCORED_PLAYER_ONE : BallStatus.SCORED_PLAYER_TWO;
    activePlayer.score = activePlayer.score + 1;
    newState.players = [activePlayer, ...nonActivePlayers];
    break;
  case GameStateAction.DEAD_BALL:
    newState.balls[payload.ballIndex] = BallStatus.DEAD;
    activePlayer.score = activePlayer.score - 1;
    newState.players = [activePlayer, ...nonActivePlayers];
    break;
  case GameStateAction.END_TURN:
    const currentIndex = prevState.players.findIndex(p => p.id === prevState.currentPlayer);
    const nextIndex = (currentIndex + 1) % prevState.players.length;
    newState.currentPlayer = prevState.players[nextIndex].id;
    newState.innings = !isPlayerOneTurn ? prevState.innings + 1 : prevState.innings; // Only increase innings if player 2 is ending the turn
    break;
  default:
    console.warn('Unknown action type: ', payload);
  }
  console.debug('Game state updated: ', JSON.stringify(newState));
  console.info('Game state updated: ', payload.type);
  return newState;
}

export default function ApaNineBall() {

  const initialState = {} as any;

  const [ gameState, dispatch ] = useReducer<GameState, any>(gameStateReducer, initialState );

  const { players: stagedPlayers } = useLocalSearchParams<{ players: string }>();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      async function fetchPlayers() {
        const loadedPlayers = await getPlayers();
        if (isActive) {
          // If there are staged players from the URL, set them in the game state
          if (stagedPlayers) {
            const gamePlayers: GamePlayer[] = [];

            const playerIds = JSON.parse(stagedPlayers);
            playerIds.forEach((playerId: string) => {
              const playerData = loadedPlayers.find(p => p.id === playerId);
              if (!playerData) return;
              gamePlayers.push({
                id: playerId,
                skill: playerData.skill9,
                name: playerData.name,
                score: 0,
                scoreTarget: getScoreGoal(playerData.skill9, 1, false)
              });
            });

            if (gamePlayers.length !== playerIds.length) {
              console.error('Could not find all players');
              return;
            }

            dispatch({ type: GameStateAction.SET_PLAYERS, players: gamePlayers });
          }
        }
      }
      fetchPlayers();
      return () => { isActive = false; };
    }, [stagedPlayers])
  );


  return (
    <View className='w-full h-full'>
      <View className='flex-1 justify-center items-center bg-text-300 dark:bg-background-900 gap-5 p-5'>
        <Text className='text-4xl font-bold text-primary mb-8'>APA 9 Ball</Text>
      </View>
    </View>
  );
}
