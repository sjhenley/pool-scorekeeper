import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useReducer, useCallback, useEffect } from 'react';
import { View, BackHandler } from 'react-native';
import { getPlayers } from '@/dao/player.dao';
import { BallStatus } from '@/models/ball-status.enum';
import { findWinner, getScoreGoal } from '@/util/score.util';
import { GamePlayer } from '@/models/game-player.model';
import { NineBallGameAction, GameState, GameStateAction, ConfirmationDialog } from '@/models/game-state.model';
import { ScoreBox, BallSelector, TurnActions, Dialog, ConfirmDialog } from '@/components';

function gameStateReducer(prevState: GameState, payload: NineBallGameAction): GameState {
  console.debug('Current game state: ', JSON.stringify({ ...prevState, prev: prevState.prev ? '...' : null }));
  console.debug('Game state update dispatched: ', payload);

  const modifiedBalls = prevState.balls?.some((ball) => ball === BallStatus.SCORED_PLAYER_ONE || ball === BallStatus.SCORED_PLAYER_TWO || ball === BallStatus.DEAD);

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
    } else if (modifiedBalls && payload.type === GameStateAction.UNDO) {
      // Prompt for confirmation if balls have been modified this turn
      return {
        ...prevState,
        dialogShown: ConfirmationDialog.UNDO
      };
    } else {
      console.info('Processing state undo action');
      return prevState.prev;
    }
  }

  // Save previous state for undo functionality
  // Deep clone previous state to avoid mutation issues
  // Note: This is not the most efficient way to handle undo, but works for now
  // For a more complex app, consider using a library like immer or redux
  const newState: GameState = { ...prevState };

  const isPlayerOneTurn = prevState.currentPlayer === prevState.players[0]?.id;

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
  case GameStateAction.SET_PLAYERS:
    newState.players = payload.players;
    newState.currentPlayer = payload.players[0].id;
    break;
  case GameStateAction.MAKE_BALL:
    newState.balls = newState.balls?.map((ball, idx) =>
      idx === payload.ballIndex
        ? (isPlayerOneTurn ? BallStatus.SCORED_PLAYER_ONE : BallStatus.SCORED_PLAYER_TWO)
        : ball
    );
    newState.players = prevState.players.map((player) => {
      const ret = { ...player };
      if (player.id === prevState.currentPlayer) {
        if (payload.ballIndex === 8) { // 9-ball
          ret.score = ret.score + 2;
        } else {
          ret.score = ret.score + 1;
        }
      }
      return ret;
    });
    break;
  case GameStateAction.DEAD_BALL:
    newState.balls = newState.balls?.map((ball, idx) =>
      idx === payload.ballIndex
        ? (idx === 8 ? BallStatus.FREE : BallStatus.DEAD) // 9-ball cannot be marked dead
        : ball
    );
    newState.players = prevState.players.map((player) => {
      const ret = { ...player };
      if (player.id === prevState.currentPlayer) {
        if (payload.ballIndex === 8) {
          ret.score = Math.max(0, ret.score - 2);
        } else {
          ret.score = Math.max(0, ret.score - 1);
        }
      }
      return ret;
    });
    break;
  case GameStateAction.FREE_BALL:
    newState.balls = newState.balls?.map((ball, idx) =>
      idx === payload.ballIndex
        ? BallStatus.FREE
        : ball
    );
    break;
  case GameStateAction.END_TURN:
    if (findWinner(prevState)) {
      newState.dialogShown = ConfirmationDialog.GAME_OVER;
    } else if (prevState.balls && prevState.balls[8] === (isPlayerOneTurn ? BallStatus.SCORED_PLAYER_ONE : BallStatus.SCORED_PLAYER_TWO)) {
      // 9-ball was scored, reset balls for new rack
      newState.balls = Array(9).fill(BallStatus.FREE);
      newState.rackTurnCount = 0;
    } else {
      // Switch to next player
      const currentIndex = prevState.players.findIndex(p => p.id === prevState.currentPlayer);
      const nextIndex = (currentIndex + 1) % prevState.players.length;
      newState.currentPlayer = prevState.players[nextIndex].id;
      newState.balls = prevState.balls?.map(ball => {
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
    newState.prev = prevState;
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
    gameId: 'apa-nine-ball',
    players: [],
    currentPlayer: '',
    matchTurnCount: 0,
    rackTurnCount: 0,
    balls: Array(9).fill(BallStatus.FREE),
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

  /** Press handler for ball selection. Dispatches different actions based on ball status
   * @param idx index of the ball pressed (0-8 for 9-ball)
   */
  const onBallPress = (idx: number) => {
    switch (gameState.balls && gameState.balls[idx]) {
    case BallStatus.FREE:
      return dispatch({ type: GameStateAction.MAKE_BALL, ballIndex: idx });
    case BallStatus.SCORED_PLAYER_ONE:
    case BallStatus.SCORED_PLAYER_TWO:
      return dispatch({ type: GameStateAction.DEAD_BALL, ballIndex: idx });
    case BallStatus.DEAD:
      return dispatch({ type: GameStateAction.FREE_BALL, ballIndex: idx });
    }
  };

  return (
    <View className='w-full h-full flex bg-text-300 dark:bg-background-900'>
      <Dialog
        isOpen={gameState.dialogShown === ConfirmationDialog.UNDO}
        onClose={() => {}}
      >
        <ConfirmDialog
          onClose={(confirmed: boolean) => dispatch({ type: confirmed ? GameStateAction.CONFIRM_UNDO : GameStateAction.CANCEL_DIALOG })}
          header='Undo Turn'
          message='Clear the current turn and return to the previous player?'
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
          onClose={(confirmed: boolean) => dispatch({ type: confirmed ? GameStateAction.CONFIRM_ABORT : GameStateAction.CANCEL_DIALOG })}
          header='Game Over'
          message={`${findWinner(gameState)?.name} wins!`}
          confirmLabel='Confirm'
          cancelLabel='Go Back'
        />
      </Dialog>
      <ScoreBox state={gameState} />
      <View className='w-full flex-grow'></View>
      <BallSelector state={gameState} onBallPress={onBallPress}/>
      <TurnActions state={gameState} onAction={dispatch}/>
    </View>
  );
}
