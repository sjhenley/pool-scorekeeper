import { GameState, GameAction, GameStateAction } from '@/models/game-state.model';
import { View } from 'react-native';
import { findWinner, getActivePlayer } from '@/util/score.util';
import { Button } from './Button';
import { BallStatus } from '@/models/ball-status.enum';

export interface TurnActionProps {
  state: GameState;
  onAction: (action: GameAction) => void;
}



export const TurnActions = ({
  state,
  onAction
}: TurnActionProps) => {
  const winner = findWinner(state);
  const activePlayer = getActivePlayer(state);
  if (!activePlayer) return null;

  const inactivePlayer = state.players.find((player) => player.id !== activePlayer.id);
  const scoredBallState = activePlayer.id === state.players[0].id ? BallStatus.SCORED_PLAYER_ONE : BallStatus.SCORED_PLAYER_TWO;

  let backButtonTitle = `Go back to ${inactivePlayer?.name}'s turn`;
  if (state.matchTurnCount === 0) {
    backButtonTitle = 'Cancel';
  } else if (state.rackTurnCount === 0) {
    if (false) {
      // TODO eight ball+
      backButtonTitle = 'Undo Game Over';
    } else {
      backButtonTitle = 'Undo New Rack';
    }
  }

  let gameOverBtn;
  let nextTurnLabel = activePlayer.name + '\'s Turn Over';

  if (false) {
    // TODO eight ball
    gameOverBtn = <Button label='End Game' primary size='lg' />;
  } else if (winner) {
    nextTurnLabel = `${winner.name} wins!`;
  } else if (state.balls[8] === scoredBallState) {
    nextTurnLabel = 'Start New Rack';
  }

  return (
    <View className='w-full p-4 gap-2 mb-6'>
      <Button label={nextTurnLabel} primary size='lg' containerClass='w-full' onPress={() => onAction({ type: GameStateAction.END_TURN })} />
      {gameOverBtn}
      <Button label={backButtonTitle} primary size='lg' transparent containerClass='w-full' onPress={() => onAction({ type: GameStateAction.UNDO })} />
    </View>
  );
};
