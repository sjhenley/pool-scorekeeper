export type SkillLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export default class Player {
  constructor(
    public name: string,
    public skill8: SkillLevel,
    public skill9: SkillLevel
  ) {}

  public toJSON(): object {
    return {
      name: this.name,
      skill8: this.skill8,
      skill9: this.skill9
    };
  }
}
