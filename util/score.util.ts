import { EIGHT_BALL_SCORE_LUT, NINE_BALL_SCORE_LUT, NINE_BALL_LOSER_SCORE_TRESHOLDS } from '@/const/score.const';
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
  // Determine the losing player
  const targetPlayerWon = playerScore >= getScoreGoal(playerSkill, opponentSkill, false);

  let loserSkillLevel: SkillLevel;
  let loserScore: number;
  if (targetPlayerWon) {
    loserSkillLevel = opponentSkill;
    loserScore = opponentScore;
  } else {
    loserSkillLevel = playerSkill;
    loserScore = playerScore;
  }

  const scoreThresholds = NINE_BALL_LOSER_SCORE_TRESHOLDS[loserSkillLevel];

  // Find the index of scoreThreshold such that loserScore <= idx and loserScore > idx - 1
  let loserMatchPoints = 0;
  for (let i = 0; i < scoreThresholds.length; i++) {
    if (loserScore <= scoreThresholds[i]) {
      loserMatchPoints = i;
      break;
    }
    // If loserScore is greater than or equal to the last threshold, they earn maximum points
    // Should not happen, the loser should not be passing the last treshold
    if (i === scoreThresholds.length - 1) {
      loserMatchPoints = scoreThresholds.length;
    }
  }

  const winnerMatchPoints = 20 - loserMatchPoints;
  return targetPlayerWon ? winnerMatchPoints : loserMatchPoints;
};

export const buildMatchResults = (state: GameState): Match => {
  return {
    gameId: state.gameId,
    matchId: randomUUID(),
    date: new Date().toISOString(),
    players: state.players.map(player => {
      let matchPoints;
      const opponent = state.players.find(p => p.id !== player.id);
      if (state.gameId === 'apa-eight-ball') {
        matchPoints = getEightBallMatchPoints(player.score, player.scoreTarget, opponent?.score || 0);
      } else if (state.gameId === 'apa-nine-ball') {
        matchPoints = getNineBallMatchPoints(player.score, player.skill, opponent?.score || 0, opponent?.skill || 1);
      }
      return {
        playerId: player.id,
        playerName: player.name,
        points: player.score,
        pointsNeeded: player.scoreTarget,
        playerSkill: player.skill,
        matchPoints
      };
    })
  };
};
