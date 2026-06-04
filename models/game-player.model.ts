import { SkillLevel } from './player';

export interface GamePlayer {
  id: string,
  skill: SkillLevel,
  name: string
  score: number
  scoreTarget: number
}
