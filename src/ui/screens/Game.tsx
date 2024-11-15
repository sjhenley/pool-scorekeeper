import React from 'react';
import { Text } from '@rneui/themed';
import { Alert, View, StyleSheet } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@app/App';
import Player from '@app/models/player';
import { getScoreGoal } from '@app/util/score.util';

type GameRouteProp = RouteProp<RootStackParamList, 'Game'>;
type GameNavigationProp = NavigationProp<RootStackParamList, 'Game'>;

interface GameProps {
  route: GameRouteProp;
  navigation: GameNavigationProp
}

interface GamePlayer extends Omit<Player, 'toJSON'> {
  score: number;
}

export function Game({ route, navigation }: GameProps) {
  const {player1, player2, isEightBall} = route.params;

  const [gamePlayer1, setGamePlayer1] = React.useState<GamePlayer>({...player1, score: 0});
  const [gamePlayer2, setGamePlayer2] = React.useState<GamePlayer>({...player2, score: 0});

  React.useEffect(
    () => {
      navigation.addListener('beforeRemove', (e) => {
        e.preventDefault();
        Alert.alert(
          'Exit Game?',
          'Incomplete game will be discarded',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => {} },
            { text: 'Continue', style: 'destructive', onPress: () => navigation.dispatch(e.data.action) },
          ]
        )
      });
    }, [navigation]
  );

  const renderPlayerBox = (player: GamePlayer, opponent: GamePlayer) => {
    const skill = isEightBall ? player.skill8 : player.skill9;
    const opponentSkill = isEightBall ? opponent.skill8 : opponent.skill9;
    const scoreGoal = getScoreGoal(skill, opponentSkill, isEightBall);
    return (
      <View style={styles.playerBox}>
        <Text h2>{player.name}</Text>
        <Text h3>Skill Level {isEightBall ? player.skill8 : player.skill9}</Text>
        <Text h3>{player.score} / {scoreGoal} points</Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.playerRow}>
        {renderPlayerBox(gamePlayer1, gamePlayer2)}
        {renderPlayerBox(gamePlayer2, gamePlayer1)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
  },
  playerRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 3,
    backgroundColor: 'black',
  },
  playerBox: {
    flex: 1,
    backgroundColor: 'lightgrey',
    padding: 10,
    marginBottom: 3
  }
});