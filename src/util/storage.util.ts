import Player from '@app/models/player';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PLAYER_LIST_KEY = 'players';

export async function savePlayerList(players: Player[]): Promise<void> {
  const list = players.map(player => player.toJSON());
  return AsyncStorage.setItem(PLAYER_LIST_KEY, JSON.stringify(list));
}

export async function loadPlayerList(): Promise<Player[]> {
  const list = await AsyncStorage.getItem(PLAYER_LIST_KEY);
  if (!list) {
    return [];
  }
  return JSON.parse(list).map((player: Player) => new Player(player.name, player.skill8, player.skill9));
}
