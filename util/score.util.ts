import { EIGHT_BALL_SCORE_LUT, NINE_BALL_SCORE_LUT, NINE_BALL_MATCH_SCORE_COLUMN_THRESHOLDS, NINE_BALL_MATCH_SCORE_LUT } from '@/const/score.const';
import { GamePlayer } from '@/models/game-player.model';
import { GameState } from '@/models/game-state.model';
import { Match } from '@/models/match.model';
import { SkillLevel } from '@/models/player';
import { randomUUID } from 'expo-crypto';

export const getScoreGoal = (skill: SkillLevel, opponentSkill: SkillLevel, isEightBall: boolean): number => {
  return isEightBall ? EIGHT_BALL_SCORE_LUT.get(`${skill}${opponentSkill}`) || 0 : NINE_BALL_SCORE_LUT.get(skill) || 0;
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

/**
 * Calculates the match points for a 9-ball match based on the scores and player sills
 * @param playerScore points scored by the target player
 * @param playerSkill skill level of the target player
 * @param opponentScore points scored by the opposing player
 * @param opponentSkill skill level of the opposing player
 * @returns match points for the target player according to the APA scoring table
 */
export const getNineBallMatchPoints = (playerScore: number, playerSkill: SkillLevel, opponentScore: number, opponentSkill: SkillLevel): number => {
  // TODO
  return 0;
};

export const buildMatchResults = (state: GameState): Match => {
  return {
    gameId: state.gameId,
    matchId: randomUUID(),
    date: new Date().toISOString(),
    players: state.players.map(player => ({
      playerId: player.id,
      playerName: player.name,
      points: player.score,
      pointsNeeded: player.scoreTarget,
      playerSkill: player.skill,
      matchPoints: 0
    }))
  };
};
