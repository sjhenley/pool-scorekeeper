import React from 'react';
import { Text, Button } from '@rneui/themed';
import { Alert, View, StyleSheet } from 'react-native';
import { EventArg, NavigationAction, NavigationProp, RouteProp } from '@react-navigation/native';
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
  const [isPlayerOneTurn, setIsPlayerOneTurn] = React.useState<boolean>(true);
  const [matchTurnCount, setMatchTurnCount] = React.useState<number>(0);
  const [gameTurnCount, setGameTurnCount] = React.useState<number>(0);
  const [previousGameTurnCount, setPreviousGameTurnCount] = React.useState<number>(0);

  const addPoints = (isPlayerOne: boolean, points: number) => {
    if (isPlayerOne) {
      setGamePlayer1({...gamePlayer1, score: gamePlayer1.score + points});
    } else {
      setGamePlayer2({...gamePlayer2, score: gamePlayer2.score + points});
    }
  }

  const removePoints = (isPlayerOne: boolean, points: number) => {
    if (isPlayerOne) {
      setGamePlayer1({...gamePlayer1, score: gamePlayer1.score - points});
    } else {
      setGamePlayer2({...gamePlayer2, score: gamePlayer2.score - points});
    }
  }

  const gameOver = (winnerName: string) => {
    Alert.alert(
      'Game Over',
      `${winnerName} wins!`,
      [
        { text: 'Undo', style: 'cancel', onPress: () => {} },
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]
    );
  };

  const isGameOver = (): string | null => {
    console.log('isGameOver', gamePlayer1.score, gamePlayer2.score, getScoreGoal(gamePlayer1.skill8, gamePlayer2.skill8, isEightBall));
    if (gamePlayer1.score === getScoreGoal(gamePlayer1.skill8, gamePlayer2.skill8, isEightBall)) {
      return gamePlayer1.name;
    } else if (gamePlayer2.score === getScoreGoal(gamePlayer2.skill8, gamePlayer1.skill8, isEightBall)) {
      return gamePlayer2.name;
    } else {
      return null;
    }
  }

  React.useEffect(() => {
    let winner = isGameOver();
      if (winner) {
        gameOver(winner);
        return;
      }
  }, [gamePlayer1, gamePlayer2]);

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
        );
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
        <Text h3>{player.score} / {scoreGoal} points</Text>
      </View>
    );
  };

  const renderPlayerInfo = (player: GamePlayer) => {
    return (
      <>
        <Text h2>{player.name}</Text>
        <Text h3>Skill Level {isEightBall ? player.skill8 : player.skill9}</Text>
      </>
    );
  };

  const renderTurnActions = () => {
    const onNextTurnClick = () => {
      setIsPlayerOneTurn(!isPlayerOneTurn);
      setMatchTurnCount(matchTurnCount + 1);
      setGameTurnCount(gameTurnCount + 1);
    }

    const onBackClick = () => {
      if (matchTurnCount === 0) {
        navigation.goBack();
      } else if (gameTurnCount === 0) {
        if (isEightBall) {
          onEightBallUndoGameOver();
        }
      } else {
        setIsPlayerOneTurn(!isPlayerOneTurn);
        setMatchTurnCount(matchTurnCount - 1);
      }
    };

    const onEightBallGameOver = () => {
      addPoints(isPlayerOneTurn, 1);
      
      setPreviousGameTurnCount(gameTurnCount);
      setGameTurnCount(0);
    }

    const onEightBallUndoGameOver = () => {
      removePoints(isPlayerOneTurn, 1);
      setMatchTurnCount(matchTurnCount - 1);
      setGameTurnCount(previousGameTurnCount);
    }

    const playerName = isPlayerOneTurn ? gamePlayer1.name : gamePlayer2.name;
    const opponentName = isPlayerOneTurn ? gamePlayer2.name : gamePlayer1.name;
    let backButtonTitle = `Go back to ${opponentName}'s turn`;
    if (matchTurnCount === 0) {
      backButtonTitle = 'Cancel';
    } else if (gameTurnCount === 0) {
      backButtonTitle = 'Undo Game Over';
    }

    return (
      <>
        <Button title={playerName + '\'s Turn Over'} onPress={onNextTurnClick} style={styles.buttonPrimary} />
        if (isEightBall) {
          <Button title='End Game' onPress={onEightBallGameOver} style={styles.buttonPrimary} />
        }
        <Button title={backButtonTitle} onPress={onBackClick} style={styles.buttonSecondary} />
      </>
    )
  }
  return (
    <View style={styles.container}>
      <View style={styles.playerRow}>
        {renderPlayerBox(gamePlayer1, gamePlayer2)}
        {renderPlayerBox(gamePlayer2, gamePlayer1)}
      </View>
      <View style={styles.inningCounter}>
        <Text h3 style={styles.textCenter}>{Math.floor(matchTurnCount / 2)} innings</Text>
      </View>
      <View style={styles.playerInfo}>
        {renderPlayerInfo(isPlayerOneTurn ? gamePlayer1 : gamePlayer2)}
      </View>
      <View style={styles.buttonContainer}>
        {renderTurnActions()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textCenter: {
    textAlign: 'center'
  },
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
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
  },
  playerInfo: {
    width: '100%',
    display: 'flex',
    padding: 10,
    flexGrow: 1 
  },
  inningCounter: {
    width: '100%',
    backgroundColor: 'lightgrey',
  },
  buttonContainer: {
    flexShrink: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: 10
  },
  buttonPrimary: {

  },
  buttonSecondary: {

  }
});