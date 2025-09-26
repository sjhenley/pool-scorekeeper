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
