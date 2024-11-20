import React from 'react';
import { Text, Button } from '@rneui/themed';
import { Alert, View, StyleSheet, Pressable, Image } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@app/App';
import Player from '@app/models/player';
import { getScoreGoal } from '@app/util/score.util';
import { BallStatus, NineBallState, PlayerTurn } from '@app/models/ball-status.enum';

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
  const [rackTurnCount, setRackTurnCount] = React.useState<number>(0);
  const [previousGameTurnCount, setPreviousGameTurnCount] = React.useState<number>(0);

  const [nineBallState, setNineBallState] = React.useState<BallStatus[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [nineBallRackHistory, setNineBallRackHistory] = React.useState<NineBallState[]>([]);

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
    let playerOneSkill = gamePlayer1.skill8;
    let playerTwoSkill = gamePlayer2.skill8;
    if (!isEightBall) {
      playerOneSkill = gamePlayer1.skill9;
      playerTwoSkill = gamePlayer2.skill9;
    }
    if (gamePlayer1.score >= getScoreGoal(playerOneSkill, playerTwoSkill, isEightBall)) {
      return gamePlayer1.name;
    } else if (gamePlayer2.score >=  getScoreGoal(playerTwoSkill, playerOneSkill, isEightBall)) {
      return gamePlayer2.name;
    } else {
      return null;
    }
  }
  const winner = isGameOver();

  React.useEffect(() => {
    const winner = isGameOver();
    if (winner && isEightBall) {
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

  const onBallPress = (ballNumber: number) => {
    let points = 1;
    if (ballNumber === 9) {
      points = 2;
    }

    const newBallState = [...nineBallState];
    if (nineBallState[ballNumber] === BallStatus.FREE) {
      newBallState[ballNumber] = BallStatus.SCORED;
      addPoints(isPlayerOneTurn, points);
    } else if (nineBallState[ballNumber] === BallStatus.SCORED) {
      if (ballNumber === 9) {
        newBallState[ballNumber] = BallStatus.FREE;
      } else {
        newBallState[ballNumber] = BallStatus.DEAD;
      }
      removePoints(isPlayerOneTurn, points);
    } else if (nineBallState[ballNumber] === BallStatus.DEAD) {
      newBallState[ballNumber] = BallStatus.FREE;
    }
    setNineBallState(newBallState);
  };

  const renderBallTracker = (ballState: BallStatus[]) => {
    const ballIcons = [
      require('@assets/balls/1.png'),
      require('@assets/balls/2.png'),
      require('@assets/balls/3.png'),
      require('@assets/balls/4.png'),
      require('@assets/balls/5.png'),
      require('@assets/balls/6.png'),
      require('@assets/balls/7.png'),
      require('@assets/balls/8.png'),
      require('@assets/balls/9.png'),
    ]

    return ballIcons.map((img, index) => {
      const displayBall = ballState[index + 1] !== BallStatus.PREV_SCORED;
      const displayScoredIndicator = ballState[index + 1] === BallStatus.SCORED;
      const displayDeadIndicator = ballState[index + 1] === BallStatus.DEAD;
      let ball, indicator;

      if (displayScoredIndicator) {
        indicator = <Image source={require('@assets/icons/accept.png')} style={styles.ballIndicactor} />;
      } else if (displayDeadIndicator) {
        indicator = <Image source={require('@assets/icons/remove.png')} style={styles.ballIndicactor} />;
      }

      if (displayBall) {
        ball = <Image source={img} style={indicator ? styles.ballScored : styles.ballIcon} />;
      }

      return (
        <Pressable key={index} onPress={() => onBallPress(index + 1)} style={styles.ballIconGroup}>
          {ball}
          {indicator}
        </Pressable>
      )
    });
  }

  const renderTurnActions = () => {
    const onNextTurnClick = () => {
      if (isEightBall) {
        setIsPlayerOneTurn(!isPlayerOneTurn);
        setMatchTurnCount(matchTurnCount + 1);
        setRackTurnCount(rackTurnCount + 1);
      } else if (winner) {
        gameOver(winner);
      } else {
        const rackState = {
          balls: [...nineBallState],
          shooter: isPlayerOneTurn ? PlayerTurn.PLAYER1 : PlayerTurn.PLAYER2,
          rackTurn: rackTurnCount,
          matchTurn: matchTurnCount,
          playerOneScore: gamePlayer1.score,
          playerTwoScore: gamePlayer2.score
        }
        console.log('SAVE STATE ', JSON.stringify(rackState, null, 2));
        setNineBallRackHistory([...nineBallRackHistory, rackState]);
        if (nineBallState[9] === BallStatus.SCORED) {
          // Player scored 9 ball, start new rack
          setNineBallState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
          setMatchTurnCount(matchTurnCount + 1);
          setRackTurnCount(0);
        } else {
          // Continue same rack
          const newBallState = nineBallState.map((state) => {
            if (state !== BallStatus.FREE) {
              return BallStatus.PREV_SCORED;
            } else {
              return BallStatus.FREE;
            }
          })
          setNineBallState(newBallState);
          setIsPlayerOneTurn(!isPlayerOneTurn);
          setMatchTurnCount(matchTurnCount + 1);
          setRackTurnCount(rackTurnCount + 1);
        }
      }
    }
    
    const promptClearBalls = () => {
      return new Promise<boolean>((resolve) => {
        Alert.alert(
          'Undo Turn',
          'Clear all balls for this turn?',
          [
            { text: 'No', style: 'cancel', onPress: () => { resolve(false); } },
            { text: 'Yes', style: 'destructive', onPress: () => { resolve(true);} }
          ],
          {
            onDismiss: () => { resolve(false); }
          }
        );
      });
      
    }

    const onBackClick = async () => {
      if (matchTurnCount === 0) {
        navigation.goBack();
      } else if (!isEightBall) {
        // If turn in progrses, confirm and clear the turn
        const turnInProgress = nineBallState.some((state) => state === BallStatus.SCORED || state === BallStatus.DEAD);
        if (turnInProgress && !await promptClearBalls()) {
          return;
        }

        const gameHistory = [...nineBallRackHistory];
        const lastState = gameHistory.pop();
        if (lastState) {
          console.log('LOAD STATE ', JSON.stringify(lastState, null, 2));
          setNineBallState(lastState.balls);
          setIsPlayerOneTurn(lastState.shooter === PlayerTurn.PLAYER1);
          setMatchTurnCount(lastState.matchTurn);
          setRackTurnCount(lastState.rackTurn);

          const newPlayerOne = {
            ...gamePlayer1,
            score: lastState.playerOneScore,
          };
          setGamePlayer1(newPlayerOne);

          const newPlayerTwo= {
            ...gamePlayer2,
            score: lastState.playerTwoScore,
          };
          setGamePlayer2(newPlayerTwo);
        }
        setNineBallRackHistory(gameHistory);
      } else if (rackTurnCount === 0) {
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
      
      setPreviousGameTurnCount(rackTurnCount);
      setRackTurnCount(0);
    }

    const onEightBallUndoGameOver = () => {
      removePoints(isPlayerOneTurn, 1);
      setMatchTurnCount(matchTurnCount - 1);
      setRackTurnCount(previousGameTurnCount);
    }

    const playerName = isPlayerOneTurn ? gamePlayer1.name : gamePlayer2.name;
    const opponentName = isPlayerOneTurn ? gamePlayer2.name : gamePlayer1.name;
    let backButtonTitle = `Go back to ${opponentName}'s turn`;
    if (matchTurnCount === 0) {
      backButtonTitle = 'Cancel';
    } else if (rackTurnCount === 0) {
      if (isEightBall) {
        backButtonTitle = 'Undo Game Over';
      } else {
        backButtonTitle = 'Undo New Rack';
      }
    }

    let gameOverBtn;
    let nextTurnLabel = playerName + '\'s Turn Over';

    if (isEightBall) {
      gameOverBtn = <Button title='End Game' onPress={onEightBallGameOver} style={styles.buttonPrimary} />
    } else if (winner) {
      nextTurnLabel = `${winner} wins!`;
    } else if (nineBallState[9] === BallStatus.SCORED) {
      nextTurnLabel = 'Start New Rack';
    } 

    return (
      <>
        <Button title={nextTurnLabel} onPress={onNextTurnClick} style={styles.buttonPrimary} />
        {gameOverBtn}
        <Button title={backButtonTitle} onPress={onBackClick} style={styles.buttonSecondary} />
      </>
    )
  }

  let balls;
  if (!isEightBall) {
    balls = (
      <View style={styles.ballContainer}>
        {renderBallTracker(nineBallState)}
      </View>
    );
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
      {balls}
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
  ballContainer: {
    backgroundColor: 'lightgrey',
    flexShrink: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    padding: 10
  },
  ballIconGroup: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60
  },
  ballIcon: {
    width: 60,
    height: 60
  },
  ballScored: {
    width: 60,
    height: 60,
    opacity: 0.6
  },
  ballIndicactor: {
    width: 30,
    height: 30,
    position: 'absolute',
    opacity: 0.8
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