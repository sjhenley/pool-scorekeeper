import { BallStatus } from './ball-status.enum';
import { GamePlayer } from './game-player.model';
import { Match } from './match.model';

export interface GameState {
  /** Game Type ID */
  gameId: string;
  /** List of players in the game */
  players: GamePlayer[];
  /** ID of the player whose turn it is */
  currentPlayer: string;
  /** Status of each ball on the table */
  balls?: BallStatus[];
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
  /** Match results, populated when the match concludes */
  matchResults?: Match;
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

  /** End the current rack */
  END_RACK = 'END_RACK',

  /** Mark current rack as point for the shooter and start a new rack */
  MARK_RACK_POINT = 'MARK_RACK_POINT',

  /** Mark current rack as point for the opponent and start a new rack */
  MARK_RACK_POINT_OPPONENT = 'MARK_RACK_POINT_OPPONENT',

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
  CANCEL_DIALOG = 'CANCEL_DIALOG',

  /** Confirm the match has concluded */
  CONFIRM_MATCH_CONCLUDED = 'CONFIRM_MATCH_CONCLUDED'
}

export enum ConfirmationDialog {
  UNDO = 'UNDO',
  GAME_OVER = 'GAME_OVER',
  ABORT = 'ABORT',
  END_RACK = 'END_RACK'
}

export type BaseGameAction = { type: GameStateAction.SET_PLAYERS; players: GamePlayer[] }
  | { type: GameStateAction.END_TURN }
  | { type: GameStateAction.CONFIRM_UNDO }
  | { type: GameStateAction.CANCEL_DIALOG }
  | { type: GameStateAction.ABORT_GAME }
  | { type: GameStateAction.CONFIRM_ABORT }
  | { type: GameStateAction.UNDO }
  | { type: GameStateAction.CONFIRM_MATCH_CONCLUDED };

export type NineBallGameAction = BaseGameAction
  | { type: GameStateAction.MAKE_BALL; ballIndex: number }
  | { type: GameStateAction.DEAD_BALL; ballIndex: number }
  | { type: GameStateAction.FREE_BALL; ballIndex: number };

export type EightBallGameAction = BaseGameAction
  | { type: GameStateAction.END_RACK }
  | { type: GameStateAction.MARK_RACK_POINT }
  | { type: GameStateAction.MARK_RACK_POINT_OPPONENT };

export type GameAction = NineBallGameAction | EightBallGameAction;
