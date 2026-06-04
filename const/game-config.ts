import { ImageSourcePropType } from 'react-native';

export interface GameConfig {
  /* Unique identifier for the game */
  id: string;
  /* Display name of the game */
  name: string;
  /* URL to the game's icon image */
  icon: ImageSourcePropType ;
  /* Description of the game */
  description: string;
  /* Number of players in the game */
  playerCount: number;
}

export const GAME_CONFIG: GameConfig[] = [
  {
    id: 'apa-nine-ball',
    name: '9 Ball',
    icon: require('../assets/balls/9.png'),
    description: 'Shoot balls in order from 1 to 9 to earn points. The first player to reach their score target wins.',
    playerCount: 2
  },
  {
    id: 'apa-eight-ball',
    name: '8 Ball',
    icon: require('../assets/balls/8.png'),
    description: 'Shoot all your designated balls (stripes or solids) and then the 8-ball to win the rack. The first player to reach their rack target wins the match.',
    playerCount: 2
  }
];
