export enum BallStatus {
  FREE,
  SCORED_PLAYER_ONE,
  SCORED_PLAYER_TWO,
  DEAD,
  PREV_SCORED_PLAYER_ONE,
  PREV_SCORED_PLAYER_TWO,
  PREV_DEAD
}

export enum PlayerTurn {
  PLAYER1,
  PLAYER2
}

export interface NineBallState {
  balls: BallStatus[];
  shooter: PlayerTurn;
  rackTurn: number;
  matchTurn: number;
  playerOneScore: number;
  playerTwoScore: number;
}
