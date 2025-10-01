import { BallStatus } from '@/models/ball-status.enum';
import { GamePlayer } from '@/models/game-player.model';
import { GameState } from '@/models/game-state.model';
import { getBallsInState } from '@/util/ball.util';
import { View, Text, Image } from 'react-native';
import { useEffect } from 'react';
import Animated, { useSharedValue, withSpring, useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import { BALL_IMAGES } from '@/const/ball-images';

const ACTIVE_BOX_SCALE = 1;
const INACTIVE_BOX_SCALE = 0.9;
const PLAYER_ONE_ACTIVE_SKEW = 0;
const PLAYER_TWO_ACTIVE_SKEW = 45;

interface PlayerBallListProps {
  /** Alignment of the list */
  align: 'left' | 'right';
  /** Indexes of balls scored by the player */
  scoredBallIndexes: number[];
}

const PlayerBallList = ({
  align,
  scoredBallIndexes
}: PlayerBallListProps) => {
  return (
    <View className={`flex-row gap-1 items-center mt-4 ${align === 'left' ? 'justify-start' : 'justify-end'}`}>
      {scoredBallIndexes.map((ballIndex, idx) => (
        <Image key={`scored-ball-${ballIndex}-${idx}`} source={BALL_IMAGES[ballIndex]} className='size-5' />
      ))}
    </View>
  );
};

interface PlayerBoxProps {
  /** Animation scale for the view */
  textAnimationScale: SharedValue<number>;
  /** Alignment of the text */
  align: 'left' | 'right';
  /** The player to display */
  player: GamePlayer;
  /** Indexes of balls scored by the player */
  scoredBallIndexes?: number[];
}

const PlayerBox = ({
  textAnimationScale,
  align,
  player,
  scoredBallIndexes
}: PlayerBoxProps) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: textAnimationScale.value }]
  }));

  return (
    <Animated.View className='flex p-4 pt-10 z-10 flex-grow' style={[animatedStyle]}>
      <Text className={`text-text-200 dark:text-text-800 font-sans text-4xl font-bold ${align === 'left' ? 'text-left' : 'text-right'}`}>{player.name}</Text>
      <Text className={`text-text-200 dark:text-text-800 font-sans text-xl ${align === 'left' ? 'text-left' : 'text-right'}`}>{player.score} / {player.scoreTarget} points</Text>
      {scoredBallIndexes && (
        <PlayerBallList align={align} scoredBallIndexes={scoredBallIndexes} />
      )}
    </Animated.View>
  );
};

export interface ScoreBoxProps {
  state: GameState
}

export const ScoreBox = ({
  state
}: ScoreBoxProps) => {
  const playerOneTextScaleValue = useSharedValue(ACTIVE_BOX_SCALE);
  const playerTwoTextScaleValue = useSharedValue(INACTIVE_BOX_SCALE);
  const activePlayerBoxSkewValue = useSharedValue(PLAYER_ONE_ACTIVE_SKEW);

  const activePlayerBoxAnimatedStyle = useAnimatedStyle(() => ({
    left: `${activePlayerBoxSkewValue.value}%`
  }));

  useEffect(() => {
    const isPlayerOneTurn = state.currentPlayer === state.players[0]?.id;
    playerOneTextScaleValue.value = withSpring(isPlayerOneTurn ? ACTIVE_BOX_SCALE : INACTIVE_BOX_SCALE);
    playerTwoTextScaleValue.value = withSpring(isPlayerOneTurn ? INACTIVE_BOX_SCALE : ACTIVE_BOX_SCALE);
    activePlayerBoxSkewValue.value = withSpring(isPlayerOneTurn ? PLAYER_ONE_ACTIVE_SKEW : PLAYER_TWO_ACTIVE_SKEW);
  }, [state.currentPlayer, state.players, activePlayerBoxSkewValue, playerOneTextScaleValue, playerTwoTextScaleValue]);

  const playerOneScoredBalls = [...getBallsInState(state.balls, BallStatus.SCORED_PLAYER_ONE), ...getBallsInState(state.balls, BallStatus.PREV_SCORED_PLAYER_ONE)];
  const playerTwoScoredBalls = [...getBallsInState(state.balls, BallStatus.SCORED_PLAYER_TWO), ...getBallsInState(state.balls, BallStatus.PREV_SCORED_PLAYER_TWO)];

  const innings = Math.floor(state.matchTurnCount / 2);
  const inningUnit = innings === 1 ? 'inning' : 'innings';

  if (!state.players.length) return null;

  return (
    <View className='flex-col w-full border-b-1 border-text-500 dark:border-text-700'>
      <Animated.View className='w-[55%] justify-center shadow-2xl bg-primary-800 dark:bg-primary-400 z-10 h-full' style={[{ position: 'absolute', top: 0, left: 50 }, activePlayerBoxAnimatedStyle]}></Animated.View>
      <View className='flex-row bg-gray-600 dark:bg-gray-400'>
        <PlayerBox
          textAnimationScale={playerOneTextScaleValue}
          align='left'
          player={state.players[0]}
          scoredBallIndexes={playerOneScoredBalls}
        />
        <PlayerBox
          textAnimationScale={playerTwoTextScaleValue}
          align='right'
          player={state.players[1]}
          scoredBallIndexes={playerTwoScoredBalls}
        />
      </View>
      <View className='z-10 w-full flex items-center pt-20' style={[{ position: 'absolute' }]}>
        <View className='align-self-center rounded-xl border-3 bg-primary-300 dark:bg-primary-800 border-text-500 dark:border-text-200'>
          <Text className='text-primary mx-8 text-2xl font-bold text-center' >{innings} {inningUnit}</Text>
        </View>
      </View>
    </View>
  );
};
