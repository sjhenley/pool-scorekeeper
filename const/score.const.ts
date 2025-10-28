import { SkillLevel } from '@/models/player';

export const NINE_BALL_SCORE_LUT = new Map<SkillLevel, number>([
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

/**
 * Point tresholds the losing shooter must reach to earn a point, organized by loser's skill level.
 * Example: If the losing player was a 5, they must reach at least 7 ball points to score 1 match point, at least 11 ball points to score 2 match points, etc.
 */
export const NINE_BALL_LOSER_SCORE_TRESHOLDS = {
  1: [2, 3, 4, 6, 7, 8, 10, 11, 13],
  2: [3, 5, 7, 8, 10, 12, 14, 16, 18],
  3: [4, 6, 9, 11, 14, 16, 19, 21, 24],
  4: [5, 8, 11, 14, 18, 21, 24, 27, 30],
  5: [6, 10, 14, 18, 22, 26, 29, 33, 37],
  6: [8, 12, 17, 22, 27, 31, 36, 40, 45],
  7: [10, 15, 21, 26, 32, 37, 43, 49, 54],
  8: [13, 19, 26, 32, 39, 45, 52, 58, 64],
  9: [17, 24, 31, 38, 46, 53, 60, 67, 74]
};

export const EIGHT_BALL_SCORE_LUT = new Map<string, number>([
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
