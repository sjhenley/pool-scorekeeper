import { BallStatus } from './ball-status.enum';
import { GamePlayer } from './game-player.model';

export interface GameState {
  /* List of players in the game*/
  players: GamePlayer[];
  /* ID of the player whose turn it is */
  currentPlayer: string;
  /* Status of each ball on the table */
  balls: BallStatus[];
  /* Reference to previous game state */
  prev: GameState | null;
  /* Number of turns played in the current rack */
  rackTurnCount: number;
  /* Number of turns played in the current match */
  matchTurnCount: number;
}

export enum GameStateAction {
  SET_PLAYERS = 'SET_PLAYERS',
  MAKE_BALL = 'MAKE_BALL',
  DEAD_BALL = 'DEAD_BALL',
  END_TURN = 'END_TURN',
  UNDO = 'UNDO',
  FREE_BALL = 'FREE_BALL'
}

export type GameAction = { type: GameStateAction.SET_PLAYERS; players: GamePlayer[] }
  | { type: GameStateAction.MAKE_BALL; ballIndex: number }
  | { type: GameStateAction.DEAD_BALL; ballIndex: number }
  | { type: GameStateAction.FREE_BALL; ballIndex: number }
  | { type: GameStateAction.END_TURN }
  | { type: GameStateAction.UNDO };
