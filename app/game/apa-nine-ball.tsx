import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useReducer, useCallback } from 'react';
import { View } from 'react-native';
import { getPlayers } from '@/dao/player.dao';
import { BallStatus } from '@/models/ball-status.enum';
import { getScoreGoal } from '@/util/score.util';
import { GamePlayer } from '@/models/game-player.model';
import { GameAction, GameState, GameStateAction } from '@/models/game-state.model';
import { ScoreBox } from '@/components/ScoreBox';
import { BallSelector } from '@/components/BallSelector';
import { TurnActions } from '@/components/TurnActions';


function gameStateReducer(prevState: GameState, payload: GameAction): GameState {
  console.debug('Current game state: ', JSON.stringify({ ...prevState, prev: prevState.prev ? '...' : null }));
  console.debug('Game state update dispatched: ', payload);

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

  const isPlayerOneTurn = prevState.currentPlayer === prevState.players[0]?.id;
  const activePlayer = prevState.players[isPlayerOneTurn ? 0 : 1];
  const nonActivePlayers = prevState.players.filter(p => p.id !== activePlayer?.id);

  switch (payload.type) {
  case GameStateAction.SET_PLAYERS:
    newState.players = payload.players;
    newState.currentPlayer = payload.players[0].id;
    break;
  case GameStateAction.MAKE_BALL:
    newState.balls = newState.balls.map((ball, idx) =>
      idx === payload.ballIndex
        ? (isPlayerOneTurn ? BallStatus.SCORED_PLAYER_ONE : BallStatus.SCORED_PLAYER_TWO)
        : ball
    );
    activePlayer.score = activePlayer.score + 1;
    newState.players = [activePlayer, ...nonActivePlayers];
    break;
  case GameStateAction.DEAD_BALL:
    newState.balls = newState.balls.map((ball, idx) =>
      idx === payload.ballIndex
        ? BallStatus.DEAD
        : ball
    );
    activePlayer.score = activePlayer.score - 1;
    newState.players = [activePlayer, ...nonActivePlayers];
    break;
  case GameStateAction.FREE_BALL:
    newState.balls = newState.balls.map((ball, idx) =>
      idx === payload.ballIndex
        ? BallStatus.FREE
        : ball
    );
    break;
  case GameStateAction.END_TURN:
    if (prevState.balls[8] === (isPlayerOneTurn ? BallStatus.SCORED_PLAYER_ONE : BallStatus.SCORED_PLAYER_TWO)) {
      // 9-ball was scored, reset balls for new rack
      newState.balls = Array(9).fill(BallStatus.FREE);
      newState.rackTurnCount = 0;
    } else {
      // Switch to next player
      const currentIndex = prevState.players.findIndex(p => p.id === prevState.currentPlayer);
      const nextIndex = (currentIndex + 1) % prevState.players.length;
      newState.currentPlayer = prevState.players[nextIndex].id;
      newState.balls = prevState.balls.map(ball => {
        switch (ball) {
        case BallStatus.SCORED_PLAYER_ONE:
          return BallStatus.PREV_SCORED_PLAYER_ONE;
        case BallStatus.SCORED_PLAYER_TWO:
          return BallStatus.PREV_SCORED_PLAYER_TWO;
        case BallStatus.DEAD:
          return BallStatus.PREV_DEAD;
        default:
          return ball;
        }
      });
      newState.rackTurnCount = prevState.rackTurnCount + 1;
      newState.matchTurnCount = prevState.matchTurnCount + 1;
    }
    break;
  default:
    console.warn('Unhandled action type: ', payload);
  }
  console.debug('Game state updated: ', JSON.stringify({ ...newState, prev: newState.prev ? '...' : null }));
  console.info('Game state updated: ', payload.type);
  return newState;
}

export default function ApaNineBall() {
  const initialState = {
    players: [],
    currentPlayer: '',
    matchTurnCount: 0,
    rackTurnCount: 0,
    balls: Array(9).fill(BallStatus.FREE),
    prev: null
  };

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

  /** Press handler for ball selection. Dispatches different actions based on ball status
   * @param idx index of the ball pressed (0-8 for 9-ball)
   */
  const onBallPress = (idx: number) => {
    switch (gameState.balls[idx]) {
    case BallStatus.FREE:
      return dispatch({ type: GameStateAction.MAKE_BALL, ballIndex: idx });
    case BallStatus.SCORED_PLAYER_ONE:
    case BallStatus.SCORED_PLAYER_TWO:
      if (idx !== 8) {
        // 9 ball cannot be marked dead
        return dispatch({ type: GameStateAction.DEAD_BALL, ballIndex: idx });
      } else {
        return dispatch({ type: GameStateAction.FREE_BALL, ballIndex: idx });
      }
    case BallStatus.DEAD:
      return dispatch({ type: GameStateAction.FREE_BALL, ballIndex: idx });
    }
  };

  return (
    <View className='w-full h-full flex bg-text-300 dark:bg-background-900'>
      <ScoreBox state={gameState} />
      <View className='w-full flex-grow'> </View>
      <BallSelector state={gameState} onBallPress={onBallPress}/>
      <TurnActions state={gameState} onAction={dispatch}/>
    </View>
  );
}
