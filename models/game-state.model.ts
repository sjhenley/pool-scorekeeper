import { BallStatus } from './ball-status.enum';
import { GamePlayer } from './game-player.model';

export interface GameState {
  /** List of players in the game */
  players: GamePlayer[];
  /** ID of the player whose turn it is */
  currentPlayer: string;
  /** Status of each ball on the table */
  balls: BallStatus[];
  /** Reference to previous game state */
  prev: GameState | null;
  /** Number of turns played in the current rack */
  rackTurnCount: number;
  /** Number of turns played in the current match */
  matchTurnCount: number;
  /** Currently shown dialog, if any */
  dialogShown?: ConfirmationDialog;
  /** Flag indicating if the game has been aborted */
  isAbort?: boolean;
}

export enum GameStateAction {
  /** Load players into the game state */
  SET_PLAYERS = 'SET_PLAYERS',

  /** Make a ball as pocketed */
  MAKE_BALL = 'MAKE_BALL',

  /** Mark a ball as dead */
  DEAD_BALL = 'DEAD_BALL',

  /** End the current player's turn */
  END_TURN = 'END_TURN',

  /** Move back to the previous shooter's turn */
  UNDO = 'UNDO',

  /** Confirm the undo action */
  CONFIRM_UNDO = 'CONFIRM_UNDO',

  /** Abort the current game */
  ABORT_GAME = 'ABORT_GAME',

  /** Confirm the abort action */
  CONFIRM_ABORT = 'CONFIRM_ABORT',

  /** Mark a ball as free */
  FREE_BALL = 'FREE_BALL',

  /** Cancel any open dialog */
  CANCEL_DIALOG = 'CANCEL_DIALOG'
}

export enum ConfirmationDialog {
  UNDO = 'UNDO',
  GAME_OVER = 'GAME_OVER',
  ABORT = 'ABORT'
}

export type GameAction = { type: GameStateAction.SET_PLAYERS; players: GamePlayer[] }
  | { type: GameStateAction.MAKE_BALL; ballIndex: number }
  | { type: GameStateAction.DEAD_BALL; ballIndex: number }
  | { type: GameStateAction.FREE_BALL; ballIndex: number }
  | { type: GameStateAction.END_TURN }
  | { type: GameStateAction.CONFIRM_UNDO }
  | { type: GameStateAction.CANCEL_DIALOG }
  | { type: GameStateAction.ABORT_GAME }
  | { type: GameStateAction.CONFIRM_ABORT }
  | { type: GameStateAction.UNDO };
