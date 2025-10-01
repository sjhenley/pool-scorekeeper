import { BALL_IMAGES } from '@/const/ball-images';
import { BallStatus } from '@/models/ball-status.enum';
import { GameState } from '@/models/game-state.model';
import { View, Image, Pressable } from 'react-native';

export interface BallSelectorProps {
  state: GameState;
  onBallPress: (idx: number) => void;
}

export const BallSelector = ({
  state,
  onBallPress
}: BallSelectorProps) => {
  console.log('Ball Selector re-render! State: ', state);
  if (!state.currentPlayer || state.players.length === 0) return;
  console.log('rendering ball selector');

  return (
    <View className='w-full flex-shrink'>
      <View className='w-full flex-shrink flex-row justify-flex-end flex-wrap gap-1 p-2'>
        {
          BALL_IMAGES.map((img, idx) => {
            if (state.balls[idx] === BallStatus.DEAD || state.balls[idx] === BallStatus.PREV_DEAD) {
              return (
                <Image key={'dead-ball-img-' + idx} source={img} className='size-10 opacity-70' />
              );
            }
          })
        }
      </View>
      <View className='flex-row flex-shrink justify-center flex-wrap gap-1 p-2 bg-primary-200 dark:bg-primary-700'>
        {
          BALL_IMAGES.map((img, idx) => {
            console.debug('Rendering ball index ', idx, ' with status ', BallStatus[state.balls[idx]]);
            const scoredBallState = state.currentPlayer === state.players[0].id ? BallStatus.SCORED_PLAYER_ONE : BallStatus.SCORED_PLAYER_TWO;
            const isBallPrevScored = state.balls[idx] === BallStatus.PREV_SCORED_PLAYER_ONE || state.balls[idx] === BallStatus.PREV_SCORED_PLAYER_TWO;
            const isBallDead = state.balls[idx] === BallStatus.PREV_DEAD;
            const displayBall = !isBallPrevScored && !isBallDead;
            const displayScoredIndicator = state.balls[idx] === scoredBallState;
            const displayDeadIndicator = state.balls[idx] === BallStatus.DEAD;
            let ball, indicator;

            if (displayScoredIndicator) {
              indicator = <Image source={require('../assets/icons/accept.png')} className='size-10 opacity-90 absolute' />;
            } else if (displayDeadIndicator) {
              indicator = <Image source={require('../assets/icons/remove.png')} className='size-10 opacity-90 absolute' />;
            }

            if (displayBall) {
              ball = <Image source={img} className={`size-20 ${indicator ? 'opacity-40' : ''}`} />;
            }

            return (
              <Pressable key={'ball-selector-img-' + idx} onPress={() => onBallPress(idx)} className='justify-center items-center w-20 h-20'>
                {ball}
                {indicator}
              </Pressable>
            );
          })
        }
      </View>
    </View>
  );
};
