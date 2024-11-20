export enum BallStatus {
  FREE,
  SCORED,
  DEAD,
  PREV_SCORED
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