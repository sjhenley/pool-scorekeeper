import { GamePlayer } from '@/models/game-player.model';
import { GameState } from '@/models/game-state.model';
import { SkillLevel } from '@/models/player';

const nineBallScoreLut = new Map<SkillLevel, number>([
  [1, 14],
  [2, 19],
  [3, 25],
  [4, 31],
  [5, 38],
  [6, 46],
  [7, 55],
  [8, 65],
  [9, 75]
]);


const eightBallScoreLut = new Map<string, number>([
  ['22', 2],
  ['23', 2],
  ['24', 2],
  ['25', 2],
  ['26', 2],
  ['27', 2],
  ['32', 3],
  ['33', 2],
  ['34', 2],
  ['35', 2],
  ['36', 2],
  ['37', 2],
  ['42', 4],
  ['43', 3],
  ['44', 3],
  ['45', 3],
  ['46', 3],
  ['47', 2],
  ['52', 5],
  ['53', 4],
  ['54', 4],
  ['55', 4],
  ['56', 4],
  ['57', 3],
  ['62', 6],
  ['63', 5],
  ['64', 5],
  ['65', 5],
  ['66', 5],
  ['67', 4],
  ['72', 7],
  ['73', 6],
  ['74', 5],
  ['75', 5],
  ['76', 5],
  ['77', 5]
]);

export const getScoreGoal = (skill: SkillLevel, opponentSkill: SkillLevel, isEightBall: boolean): number => {
  return isEightBall ? eightBallScoreLut.get(`${skill}${opponentSkill}`) || 0 : nineBallScoreLut.get(skill) || 0;
};

/** Analyzes the game state and returns the winning player, if any
 * @param state current game state
 * @returns winning player, or null if no winner yet
 */
export const findWinner = (state: GameState): GamePlayer | null => {
  for (const player of state.players) {
    if (player.score >= player.scoreTarget) {
      return player;
    }
  }
  return null;
};

/**
 * Returns the active player based on the current game state
 * @param state current game state
 * @returns active player, or null if not found
 */
export const getActivePlayer = (state: GameState): GamePlayer | null => {
  return state.players.find(p => p.id === state.currentPlayer) || null;
};

/**
 * Calculates the match points for an 8-ball match based on the scores
 * @param playerScore number of racks won by the target player
 * @param playerScoreTarget total number of racks player needed to win the match
 * @param opponentScore number of racks won by the opposing player
 * @returns match points for the target player according to the APA scoring table
 */
export const getEightBallMatchPoints = (playerScore: number, playerScoreTarget: number, opponentScore: number): number => {
  if (playerScore >= playerScoreTarget) {
    // Target player won the match
    if (opponentScore === 0) {
      return 3; // Shutout win
    } else {
      return 2;
    }
  } else {
    // Target player lost the match
    if (playerScore === playerScoreTarget - 1) {
      // Player was one point away from winning
      return 1;
    } else {
      return 0;
    }
  }
};
