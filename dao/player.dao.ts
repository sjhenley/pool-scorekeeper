// FYI: In android, total async storage limit is 6MB
import Player from '@/models/player';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PLAYER_STORAGE_KEY = 'players';

/**
 * Fetches all players from AsyncStorage.
 * Returns an array of Player objects, or an empty array if none are found.
 */
export async function getPlayers(): Promise<Player[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(PLAYER_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error fetching players:', e);
    return [];
  }
}

/**
 * Fetches a single player by their ID from AsyncStorage.
 * Returns the Player object if found, otherwise undefined.
 * @param playerId - The unique ID of the player to fetch.
 */
export async function getPlayerById(playerId: string): Promise<Player | undefined> {
  const players = await getPlayers();
  return players.find(p => p.id === playerId);
}

/**
 * Adds a new player or updates an existing player in AsyncStorage.
 * If a player with the same ID exists, it is updated; otherwise, a new player is added.
 * @param player - The Player object to add or update.
 */
export async function putPlayer(player: Player): Promise<void> {
  // if player with same id exists, update it
  const players = await getPlayers();
  const index = players.findIndex(p => p.id === player.id);
  if (index !== -1) {
    players[index] = player;
  } else {
    players.push(player);
  }
  await AsyncStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(players));
}

/**
 * Deletes a player by their ID from AsyncStorage.
 * Removes the player from the stored array and updates AsyncStorage.
 * @param playerId - The unique ID of the player to delete.
 */
export async function deletePlayer(playerId: string): Promise<void> {
  const players = await getPlayers();
  const updatedPlayers = players.filter(p => p.id !== playerId);
  await AsyncStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(updatedPlayers));
}
