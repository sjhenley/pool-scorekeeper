import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useReducer, useCallback, useEffect } from 'react';
import { View, BackHandler } from 'react-native';
import { getPlayers } from '@/dao/player.dao';
import { findWinner, getScoreGoal } from '@/util/score.util';
import { GamePlayer } from '@/models/game-player.model';
import { EightBallGameAction, GameState, GameStateAction, ConfirmationDialog } from '@/models/game-state.model';
import { ScoreBox } from '@/components/ScoreBox';
import { TurnActions } from '@/components/TurnActions';
import { Dialog } from '@/components/Dialog';
import { ConfirmDialog } from '@/components';

function gameStateReducer(prevState: GameState, payload: EightBallGameAction): GameState {
  console.debug('Current game state: ', JSON.stringify({ ...prevState, prev: prevState.prev ? '...' : null }));
  console.debug('Game state update dispatched: ', payload);

  if (!prevState?.players?.length && payload.type !== GameStateAction.SET_PLAYERS) {
    // players must be set first
    console.warn('Players must be set before other actions can be performed');
    return prevState;
  } else if (payload.type === GameStateAction.UNDO || payload.type === GameStateAction.CONFIRM_UNDO) {
    if (!prevState?.prev) {
      // Prompt to cancel the match
      return {
        ...prevState,
        dialogShown: ConfirmationDialog.ABORT
      };
    } else if (prevState.rackTurnCount === 0 && payload.type === GameStateAction.UNDO) {
      // Prompt to undo to previous rack
      return {
        ...prevState,
        dialogShown: ConfirmationDialog.UNDO
      };
    } else {
      console.info('Processing state undo action');
      console.debug('Loading previous state: ', JSON.stringify({ ...prevState.prev, prev: prevState.prev.prev ? '...' : null }));
      return prevState.prev;
    }
  }

  // Save previous state for undo functionality
  // Deep clone previous state to avoid mutation issues
  // Note: This is not the most efficient way to handle undo, but works for now
  // For a more complex app, consider using a library like immer or redux
  const newState: GameState = { ...prevState };

  switch (payload.type) {
  case GameStateAction.CANCEL_DIALOG:
    newState.dialogShown = undefined;
    break;
  case GameStateAction.ABORT_GAME:
    newState.dialogShown = ConfirmationDialog.ABORT;
    break;
  case GameStateAction.CONFIRM_ABORT:
    newState.isAbort = true;
    break;
  case GameStateAction.END_RACK:
    newState.prev = prevState;
    newState.dialogShown = ConfirmationDialog.END_RACK;
    break;
  case GameStateAction.SET_PLAYERS:
    newState.players = payload.players;
    newState.currentPlayer = payload.players[0].id;
    break;
  case GameStateAction.MARK_RACK_POINT:
    // Award point to current player
    newState.players = newState.players.map(player => {
      if (player.id === newState.currentPlayer) {
        return { ...player, score: player.score + 1 };
      }
      return player;
    });

    // Check if there's a winner
    if (findWinner(newState)) {
      newState.dialogShown = ConfirmationDialog.GAME_OVER;
    } else {
      newState.dialogShown = undefined;
      newState.rackTurnCount = 0;
    }
    break;
  case GameStateAction.MARK_RACK_POINT_OPPONENT:
    // Award point to opponent
    newState.players = newState.players.map(player => {
      if (player.id !== newState.currentPlayer) {
        return { ...player, score: player.score + 1 };
      }
      return player;
    });

    // Check if there's a winner
    if (findWinner(newState)) {
      newState.dialogShown = ConfirmationDialog.GAME_OVER;
    } else {
      // Opponent starts next rack
      newState.dialogShown = undefined;
      newState.matchTurnCount = prevState.matchTurnCount + 1;
      newState.rackTurnCount = 0;
      newState.currentPlayer = newState.players.find(player => player.id !== newState.currentPlayer)?.id || '';
    }
    break;
  case GameStateAction.END_TURN:
    // Advance turn to next player
    const currentIndex = prevState.players.findIndex(p => p.id === prevState.currentPlayer);
    const nextIndex = (currentIndex + 1) % prevState.players.length;
    newState.currentPlayer = prevState.players[nextIndex].id;
    newState.rackTurnCount = prevState.rackTurnCount + 1;
    newState.matchTurnCount = prevState.matchTurnCount + 1;
    newState.prev = prevState;
    break;
  default:
    console.warn('Unhandled action type: ', payload);
  }
  console.debug('Game state updated: ', JSON.stringify({ ...newState, prev: newState.prev ? '...' : null }));
  console.info('Game state updated: ', payload.type);
  return newState;
}

export default function ApaEightBall() {
  const initialState = {
    gameId: 'apa-eight-ball',
    players: [],
    currentPlayer: '',
    matchTurnCount: 0,
    rackTurnCount: 0,
    prev: null
  };

  const [ gameState, dispatch ] = useReducer<GameState, any>(gameStateReducer, initialState);
  const { players: stagedPlayers } = useLocalSearchParams<{ players: string }>();

  const router = useRouter();

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

            if (playerIds.length !== 2) {
              console.error('Incorrect player count');
              return;
            }

            const playerOneData = loadedPlayers.find(p => p.id === playerIds[0]);
            const playerTwoData = loadedPlayers.find(p => p.id === playerIds[1]);

            if (!playerOneData || !playerTwoData) {
              console.error('Could not find all player data');
              return;
            }

            // load player 1
            gamePlayers.push({
              id: playerIds[0],
              skill: playerOneData?.skill8,
              name: playerOneData?.name,
              score: 0,
              scoreTarget: getScoreGoal(playerOneData?.skill8, playerTwoData?.skill8, true)
            });

            // load player 2
            gamePlayers.push({
              id: playerIds[1],
              skill: playerTwoData?.skill8,
              name: playerTwoData?.name,
              score: 0,
              scoreTarget: getScoreGoal(playerTwoData?.skill8, playerOneData?.skill8, true)
            });

            dispatch({ type: GameStateAction.SET_PLAYERS, players: gamePlayers });
          }
        }
      }
      fetchPlayers();
      return () => { isActive = false; };
    }, [stagedPlayers])
  );

  useEffect(() => {
    if (!!gameState?.isAbort) {
      // Game has been aborted, navigate back to home
      router.replace('/');
    }
  }, [gameState, router]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        dispatch({ type: GameStateAction.ABORT_GAME });
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View className='w-full h-full flex bg-text-300 dark:bg-background-900'>
      <Dialog
        isOpen={gameState.dialogShown === ConfirmationDialog.UNDO}
        onClose={() => {}}
      >
        <ConfirmDialog
          onClose={(confirmed: boolean) => dispatch({ type: confirmed ? GameStateAction.CONFIRM_UNDO : GameStateAction.CANCEL_DIALOG })}
          header='Undo Rack Over'
          message='Move back to the previous rack?'
          confirmLabel='Yes'
          cancelLabel='No'
        />
      </Dialog>
      <Dialog
        isOpen={gameState.dialogShown === ConfirmationDialog.ABORT}
        onClose={() => {}}
      >
        <ConfirmDialog
          onClose={(confirmed: boolean) => dispatch({ type: confirmed ? GameStateAction.CONFIRM_ABORT : GameStateAction.CANCEL_DIALOG })}
          header='End Game'
          message='Match will not be saved. Are you sure you want to abort the game?'
          confirmLabel='Yes'
          cancelLabel='No'
        />
      </Dialog>
      <Dialog
        isOpen={gameState.dialogShown === ConfirmationDialog.GAME_OVER}
        onClose={() => {}}
      >
        <ConfirmDialog
          onClose={(confirmed: boolean) => dispatch({ type: confirmed ? GameStateAction.CONFIRM_ABORT : GameStateAction.CONFIRM_UNDO })}
          header='Game Over'
          message={`${findWinner(gameState)?.name} wins!`}
          confirmLabel='Confirm'
          cancelLabel='Go Back'
        />
      </Dialog>
      <Dialog
        isOpen={gameState.dialogShown === ConfirmationDialog.END_RACK}
        onClose={() => {}}
      >
        <ConfirmDialog
          onClose={(shooterWon: boolean) => dispatch({ type: shooterWon ? GameStateAction.MARK_RACK_POINT : GameStateAction.MARK_RACK_POINT_OPPONENT })}
          header='End Rack'
          message='Did the current shooter win the rack?'
          confirmLabel='Yes'
          cancelLabel='No'
        />
      </Dialog>
      <ScoreBox state={gameState} />
      <View className='w-full flex-grow'></View>
      <TurnActions state={gameState} onAction={dispatch}/>
    </View>
  );
}
