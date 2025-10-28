import { Match } from '@/models/match.model';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'match_history';

/**
 * Fetches all match history records from AsyncStorage.
 * @returns an array of Match objects.
 */
export async function getMatchHistory(): Promise<Match[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error fetching match history:', e);
    return [];
  }
}

/** Retrieve match details with the specified ID
 * @param matchId unique identifier of the match
 * @returns Match object if found, otherwise undefined
 */
export async function getMatchById(matchId: string): Promise<Match | undefined> {
  const matches = await getMatchHistory();
  return matches.find(m => m.matchId === matchId);
}

/** Retrieve matches with the specified game ID
 * @param gameId unique identifier of the game type (e.g. "apa-nine-ball")
 * @returns array of Match objects
 */
export async function getMatchesByGameId(gameId: string): Promise<Match[]> {
  const matches = await getMatchHistory();
  return matches.filter(m => m.gameId === gameId);
}

/** Deletes match with specified ID from history
 * @param matchId unique identifier of the match to delete
 */
export async function deleteMatchById(matchId: string): Promise<void> {
  const matches = await getMatchHistory();
  const updatedMatches = matches.filter(m => m.matchId !== matchId);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMatches));
}

/** Adds a new match record to history
 * @param match Match object to add
 * @return Promise that resolves when the operation is complete
 */
export async function addMatchToHistory(match: Match): Promise<void> {
  const matches = await getMatchHistory();
  matches.push(match);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
}
