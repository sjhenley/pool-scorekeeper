
/** Match participant */
export interface MatchPlayer {
  /** Player ID */
  playerId: string;
  /** Player name */
  playerName: string;
  /** Points scored by the player in the match */
  points: number;
  /** Points needed by the player to win the match */
  pointsNeeded: number;
  /** Player skill rating */
  playerSkill?: number;
  /** Points that would be scored in an APA league match */
  matchPoints?: number;
}

/** Details of a completed match */
export interface Match {
  /** id for the game type played */
  gameId: string;
  /** List of players in the match */
  players: MatchPlayer[];
  /** Date when the match was played */
  date: string;
  /** Unique identifier for the match */
  matchId: string;
}
