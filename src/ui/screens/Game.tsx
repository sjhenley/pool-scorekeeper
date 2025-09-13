import React from 'react';
import { Text, Button, CheckBox, Dialog, useTheme } from '@rn-vui/themed';
import { Alert, View, StyleSheet, Pressable, Image } from 'react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@app/App';
import Player from '@app/models/player';
import { getScoreGoal } from '@app/util/score.util';
import { BallStatus, NineBallState, PlayerTurn } from '@app/models/ball-status.enum';
import { useGlobalStyles } from '@app/styles';

type GameRouteProp = RouteProp<RootStackParamList, 'Game'>;
type GameNavigationProp = NavigationProp<RootStackParamList, 'Game'>;

const ballIcons = [
  require('@assets/balls/1.png'),
  require('@assets/balls/2.png'),
  require('@assets/balls/3.png'),
  require('@assets/balls/4.png'),
  require('@assets/balls/5.png'),
  require('@assets/balls/6.png'),
  require('@assets/balls/7.png'),
  require('@assets/balls/8.png'),
  require('@assets/balls/9.png')
];

interface GameProps {
  route: GameRouteProp;
  navigation: GameNavigationProp
}

interface GamePlayer extends Omit<Player, 'toJSON'> {
  score: number;
}

export function Game({ route, navigation }: GameProps) {
  const globalStyle = useGlobalStyles();
  const theme = useTheme().theme;

  const { player1, player2, isEightBall } = route.params;

  const [gamePlayer1, setGamePlayer1] = React.useState<GamePlayer>({ ...player1, score: 0 });
  const [gamePlayer2, setGamePlayer2] = React.useState<GamePlayer>({ ...player2, score: 0 });
  const [isPlayerOneTurn, setIsPlayerOneTurn] = React.useState<boolean>(true);

  React.useEffect(() => {
    playerScaleAnimation(isPlayerOneTurn);
  }, [isPlayerOneTurn]);

  /** Player Box Animation Refs **/
  const ACTIVE_BOX_SCALE = 1;
  const INACTIVE_BOX_SCALE = 0.9;
  const PLAYER_ONE_ACTIVE_SKEW = 0;
  const PLAYER_TWO_ACTIVE_SKEW = 45;
  const playerOneBoxTextScaleValue = useSharedValue(ACTIVE_BOX_SCALE);
  const playerTwoBoxTextScaleValue = useSharedValue(INACTIVE_BOX_SCALE);
  const activePlayerBoxSkewValue = useSharedValue(PLAYER_ONE_ACTIVE_SKEW);
  const playerOneBoxAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playerOneBoxTextScaleValue.value }]
  }));
  const playerTwoBoxAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playerTwoBoxTextScaleValue.value }]
  }));
  const activePlayerBoxAnimatedStyle = useAnimatedStyle(() => ({
    left: `${activePlayerBoxSkewValue.value}%`
  }));

  const [shooterWins, setShooterWins] = React.useState<boolean>(true); // 8 ball to track undo match over
  const [matchTurnCount, setMatchTurnCount] = React.useState<number>(0);
  const [rackTurnCount, setRackTurnCount] = React.useState<number>(0);
  const [previousGameTurnCount, setPreviousGameTurnCount] = React.useState<number>(0);
  const [isEightBallDialogVisible, setIsEightBallDialogVisible] = React.useState<boolean>(false);
  const [eightBallDialogState, setEightBallDialogState] = React.useState<number>(0);

  const [nineBallState, setNineBallState] = React.useState<BallStatus[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [nineBallRackHistory, setNineBallRackHistory] = React.useState<NineBallState[]>([]);

  /**
   * Trigger animations to switch player focus
   * @param isPlayerOneTurn True if player one is next, false if player two is next
   */
  const playerScaleAnimation = (isPlayerOneTurn: boolean) => {
    const targetIncreaseScale = isPlayerOneTurn ? playerOneBoxTextScaleValue : playerTwoBoxTextScaleValue;
    const targetDecreaseScale = isPlayerOneTurn ? playerTwoBoxTextScaleValue : playerOneBoxTextScaleValue;

    targetIncreaseScale.value = withSpring(ACTIVE_BOX_SCALE);
    targetDecreaseScale.value = withSpring(INACTIVE_BOX_SCALE);
    activePlayerBoxSkewValue.value= withSpring(isPlayerOneTurn ? PLAYER_ONE_ACTIVE_SKEW : PLAYER_TWO_ACTIVE_SKEW);
  };

  const addPoints = (isPlayerOne: boolean, points: number) => {
    if (isPlayerOne) {
      setGamePlayer1({ ...gamePlayer1, score: gamePlayer1.score + points });
    } else {
      setGamePlayer2({ ...gamePlayer2, score: gamePlayer2.score + points });
    }
  };

  const removePoints = (isPlayerOne: boolean, points: number) => {
    if (isPlayerOne) {
      setGamePlayer1({ ...gamePlayer1, score: gamePlayer1.score - points });
    } else {
      setGamePlayer2({ ...gamePlayer2, score: gamePlayer2.score - points });
    }
  };

  const undoGameOver = (playerOneWins: boolean) => {
    if (isEightBall) {
      removePoints(playerOneWins, 1);
      setRackTurnCount(previousGameTurnCount);
      setMatchTurnCount(matchTurnCount - 1);
      if (!shooterWins) {
        setIsPlayerOneTurn(!isPlayerOneTurn);
      }
    }
  };

  const gameOver = (winnerName: string) => {
    Alert.alert(
      'Game Over',
      `${winnerName} wins!`,
      [
        { text: 'Undo', style: 'cancel', onPress: () => undoGameOver(winnerName === gamePlayer1.name) },
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
    } else if (gamePlayer2.score >= getScoreGoal(playerTwoSkill, playerOneSkill, isEightBall)) {
      return gamePlayer2.name;
    } else {
      return null;
    }
  };
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
            { text: 'Confirm', style: 'destructive', onPress: () => navigation.dispatch(e.data.action) }
          ]
        );
      });
    }, [navigation]
  );

  const renderPlayerBox = (player: GamePlayer, scoreGoal: number, align: 'left' | 'right') => {
    const playerAnimationStyle = player === gamePlayer1 ? playerOneBoxAnimatedStyle : playerTwoBoxAnimatedStyle;
    let ballTracker: React.JSX.Element | null = null;
    if (!isEightBall) {
      ballTracker = (
        <View style={[styles.playerBallIconGroup, { justifyContent: align === 'left' ? 'flex-start' : 'flex-end' }]}>
          {renderPlayerBallTracker(nineBallState, align === 'left')}
        </View>
      );
    }
    return (
      <Animated.View style={[styles.playerBox, playerAnimationStyle]}>
        <Text style={[globalStyle.background, globalStyle.textLarge, align === 'left' ? globalStyle.textLeft : globalStyle.textRight, globalStyle.primary]}>{player.name}</Text>
        <Text style={[globalStyle.background, globalStyle.textMedium, align === 'left' ? globalStyle.textLeft : globalStyle.textRight, globalStyle.primary]}>{player.score} / {scoreGoal} points</Text>
        {ballTracker}
      </Animated.View>
    );
  };

  const renderPlayerBallTracker = (ballState: BallStatus[], isPlayerOne: boolean) => {
    return ballIcons.map((img, index) => {
      const ballScoredState = isPlayerOne ? BallStatus.SCORED_PLAYER_ONE : BallStatus.SCORED_PLAYER_TWO;
      const ballPrevScoredState = isPlayerOne ? BallStatus.PREV_SCORED_PLAYER_ONE : BallStatus.PREV_SCORED_PLAYER_TWO;
      if (ballState[index + 1] === ballScoredState || ballState[index + 1] === ballPrevScoredState) {
        return (
          <Image key={index} source={img} style={styles.playerBallIcon} />
        )
      }
    });
  };

  const renderPlayerInfo = (player: GamePlayer, scoreGoal: number, isEightBall: boolean) => {
    const remainingPoints = scoreGoal - player.score;
    let pointUnit: string;
    let scoreInfo: string;
    if (remainingPoints <= 0) {
      scoreInfo = `${player.name} wins!`;
    } else {
      pointUnit = isEightBall ? 'games' : 'points';
      if (remainingPoints === 1) {
        pointUnit =  pointUnit.slice(0, -1);
      }
      scoreInfo = `${remainingPoints} ${pointUnit} remaining`;
    }
    return (
      <>
        <Text style={[globalStyle.primary]} h2>{player.name}</Text>
        <Text style={[globalStyle.primary]} h3>Skill Level {isEightBall ? player.skill8 : player.skill9}</Text>
        <Text style={[globalStyle.primary]}>{scoreInfo}</Text>
      </>
    );
  };

  const onBallPress = (ballNumber: number) => {
    let points = 1;
    if (ballNumber === 9) {
      points = 2;
    }

    const scoredBallState = isPlayerOneTurn ? BallStatus.SCORED_PLAYER_ONE : BallStatus.SCORED_PLAYER_TWO;

    const newBallState = [...nineBallState];
    if (nineBallState[ballNumber] === BallStatus.FREE) {
      newBallState[ballNumber] = scoredBallState;
      addPoints(isPlayerOneTurn, points);
    } else if (nineBallState[ballNumber] === scoredBallState) {
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
    const scoredBallState = isPlayerOneTurn ? BallStatus.SCORED_PLAYER_ONE : BallStatus.SCORED_PLAYER_TWO;
    return ballIcons.map((img, index) => {
      const isBallPrevScored = ballState[index + 1] === BallStatus.PREV_SCORED_PLAYER_ONE || ballState[index + 1] === BallStatus.PREV_SCORED_PLAYER_TWO;
      const isBallDead = ballState[index + 1] == BallStatus.PREV_DEAD
      const displayBall = !isBallPrevScored && !isBallDead;
      const displayScoredIndicator = ballState[index + 1] === scoredBallState;
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
      );
    });
  };

  const renderDeadBallTracker = (ballState: BallStatus[]) => {
    return ballIcons.map((img, index) => {
      if (ballState[index + 1] === BallStatus.DEAD || ballState[index + 1] === BallStatus.PREV_DEAD) {
        return (
          <Image key={index} source={img} style={styles.deadBallIcon} />
        )
      }
    });
  };

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
        };
        console.log('SAVE STATE ', JSON.stringify(rackState, null, 2));
        setNineBallRackHistory([...nineBallRackHistory, rackState]);
        const scoredBallState = isPlayerOneTurn ? BallStatus.SCORED_PLAYER_ONE : BallStatus.SCORED_PLAYER_TWO;
        const prevScoredState = isPlayerOneTurn ? BallStatus.PREV_SCORED_PLAYER_ONE : BallStatus.PREV_SCORED_PLAYER_TWO;
        if (nineBallState[9] === scoredBallState) {
          // Player scored 9 ball, start new rack
          setNineBallState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
          setMatchTurnCount(matchTurnCount + 1);
          setRackTurnCount(0);
        } else {
          // Continue same rack
          const newBallState = nineBallState.map((state) => {
            switch (state) {
              case BallStatus.FREE:
              case BallStatus.PREV_SCORED_PLAYER_ONE:
              case BallStatus.PREV_SCORED_PLAYER_TWO:
              case BallStatus.PREV_DEAD:
                return state;
              case BallStatus.DEAD:
                return BallStatus.PREV_DEAD;
              default:
                return prevScoredState;
            }
          });
          setNineBallState(newBallState);
          setIsPlayerOneTurn(!isPlayerOneTurn);
          setMatchTurnCount(matchTurnCount + 1);
          setRackTurnCount(rackTurnCount + 1);
        }
      }
    };

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

    };

    const onBackClick = async () => {
      if (matchTurnCount === 0) {
        navigation.goBack();
      } else if (!isEightBall) {
        // If turn in progrses, confirm and clear the turn
        const scoredBallState = isPlayerOneTurn ? BallStatus.SCORED_PLAYER_ONE : BallStatus.SCORED_PLAYER_TWO;
        const turnInProgress = nineBallState.some((state) => state === scoredBallState || state === BallStatus.DEAD);
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
            score: lastState.playerOneScore
          };
          setGamePlayer1(newPlayerOne);

          const newPlayerTwo= {
            ...gamePlayer2,
            score: lastState.playerTwoScore
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

    const onEightBallUndoGameOver = () => {
      removePoints(isPlayerOneTurn, 1);
      setMatchTurnCount(matchTurnCount - 1);
      setRackTurnCount(previousGameTurnCount);

      if (!shooterWins) {
        setIsPlayerOneTurn(!isPlayerOneTurn);
      }
    };

    const playerName = isPlayerOneTurn ? gamePlayer1.name : gamePlayer2.name;
    const opponentName = isPlayerOneTurn ? gamePlayer2.name : gamePlayer1.name;
    const scoredBallState = isPlayerOneTurn ? BallStatus.SCORED_PLAYER_ONE : BallStatus.SCORED_PLAYER_TWO;
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
      gameOverBtn = <Button title='End Game' type='clear' containerStyle={[{backgroundColor: theme.colors.grey2}, styles.turnCta]} buttonStyle={[globalStyle.buttonLarge, styles.turnCta]} titleStyle={[globalStyle.textLarge, globalStyle.primary]} onPress={() => setIsEightBallDialogVisible(true)} />;
    } else if (winner) {
      nextTurnLabel = `${winner} wins!`;
    } else if (nineBallState[9] === scoredBallState) {
      nextTurnLabel = 'Start New Rack';
    }

    return (
      <>
        <Button title={nextTurnLabel} type='clear' containerStyle={[{backgroundColor: theme.colors.grey2}, styles.turnCta]} buttonStyle={[globalStyle.buttonLarge, styles.turnCta]} titleStyle={[globalStyle.textLarge, globalStyle.primary]} onPress={onNextTurnClick} />
        {gameOverBtn}
        <Button title={backButtonTitle} type='clear' containerStyle={[{backgroundColor: theme.colors.error}, styles.turnCta]} buttonStyle={[globalStyle.buttonLarge, styles.turnCta]} titleStyle={[globalStyle.textLarge, globalStyle.primary]} onPress={onBackClick} />
      </>
    );
  };

  const onEightBallGameOver = (shooterWinsRack: boolean) => {
    setShooterWins(shooterWinsRack);
    const playerOneWins = isPlayerOneTurn === shooterWinsRack;
    addPoints(playerOneWins, 1);
    setIsPlayerOneTurn(playerOneWins);
    setPreviousGameTurnCount(rackTurnCount);
    setRackTurnCount(0);
    setMatchTurnCount(matchTurnCount + 1);
  };

  const onCloseDialog = () => {
    setEightBallDialogState(0);
    setIsEightBallDialogVisible(false);
  };

  const renderEightBallRackOverDialog = () => {
    const curPlayer = isPlayerOneTurn ? gamePlayer1 : gamePlayer2;
    return (
      <Dialog
        isVisible={isEightBallDialogVisible}
        onBackdropPress={onCloseDialog}
        overlayStyle={globalStyle.dialog}
        style={globalStyle.dialog}
      >
        <Dialog.Title titleStyle={[globalStyle.background, globalStyle.textLarge]} title={'Rack Over'} />
        <Text style={[globalStyle.background, globalStyle.textMedium]}>How did {curPlayer.name} make the 8 ball?</Text>
        <View>
          <CheckBox
            checked={eightBallDialogState === 0}
            onPress={() => setEightBallDialogState(0)}
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            title='Made the 8 ball'
            containerStyle={{
              backgroundColor: theme.colors.primary
            }}
            textStyle={[globalStyle.textMedium, globalStyle.background]}
            style={{borderColor: theme.colors.secondary}}
            checkedColor={theme.colors.background}
            uncheckedColor={theme.colors.background}
          />
          <CheckBox
            checked={eightBallDialogState === 1}
            onPress={() => setEightBallDialogState(1)}
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            title='Made the 8 ball early'
            containerStyle={{
              backgroundColor: theme.colors.primary
            }}
            textStyle={[globalStyle.textMedium, globalStyle.background]}
            style={{borderColor: theme.colors.secondary}}
            checkedColor={theme.colors.background}
            uncheckedColor={theme.colors.background}
          />
        </View>
        <Dialog.Actions>
          <View style={ styles.dialogActions }>
            <Dialog.Button
              title='Cancel'
              buttonStyle={globalStyle.buttonMedium}
              containerStyle={globalStyle.buttonError}
              titleStyle={globalStyle.textMedium}
              onPress={onCloseDialog}
            />
            <Dialog.Button 
              title='Confirm'
              buttonStyle={globalStyle.buttonMedium}
              containerStyle={globalStyle.buttonPrimary}
              titleStyle={globalStyle.textMedium}
              onPress={() => { onEightBallGameOver(eightBallDialogState === 0); onCloseDialog(); }}
            />
          </View>
        </Dialog.Actions>
      </Dialog>
    );
  };

  let balls;
  if (!isEightBall) {
    balls = (
      <View style={styles.ballContainer}>
        <View style={styles.deadBallContainer}>
          {renderDeadBallTracker(nineBallState)}
        </View>
        <View style={[styles.ballScoringContainer, { backgroundColor: theme.colors.secondary}]}>
          {renderBallTracker(nineBallState)}
        </View>
      </View>
    );
  }

  const playerOneSkill = isEightBall ? gamePlayer1.skill8 : gamePlayer1.skill9;
  const playerTwoSkill = isEightBall ? gamePlayer2.skill8 : gamePlayer2.skill9;
  const playerOneScoreGoal = getScoreGoal(playerOneSkill, playerTwoSkill, isEightBall);
  const playerTwoScoreGoal = getScoreGoal(playerTwoSkill, playerOneSkill, isEightBall);
  const innings = Math.floor(matchTurnCount / 2);
  const inningUnit = innings === 1 ? 'inning' : 'innings';

  return (
    <View style={globalStyle.container}>
      <View style={[styles.header, { borderColor: theme.colors.grey1}]}>
        <Animated.View style={[styles.activePlayerHighlight, activePlayerBoxAnimatedStyle, { backgroundColor: theme.colors.secondary}]}></Animated.View>
        <View style={[styles.playerRow]}>
          {renderPlayerBox(gamePlayer1, playerOneScoreGoal, 'left')}
          {renderPlayerBox(gamePlayer2, playerTwoScoreGoal, 'right')}
        </View>
        <View style={[styles.inningCounter, {backgroundColor: theme.colors.grey0,  borderColor: theme.colors.grey1}]}>
          <Text style={[globalStyle.background, globalStyle.textMedium, globalStyle.textCenter, globalStyle.bold]}>{innings} {inningUnit} </Text>
        </View>
      </View>
      <View style={styles.playerInfo}>
        {renderPlayerInfo(isPlayerOneTurn ? gamePlayer1 : gamePlayer2, isPlayerOneTurn ? playerOneScoreGoal : playerTwoScoreGoal, isEightBall)}
      </View>
      {balls}
      <View style={styles.buttonContainer}>
        {renderTurnActions()}
      </View>
      {renderEightBallRackOverDialog()}
    </View>
  );
}

const styles = StyleSheet.create({
  playerRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  playerBox: {
    flex: 1,
    padding: 10,
    paddingTop: 30,
    paddingHorizontal: 15,
    zIndex: 1
  },
  activePlayerHighlight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '55%',
    justifyContent: 'center',
  },
  playerInfo: {
    width: '100%',
    display: 'flex',
    padding: 10,
    flexGrow: 1
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    borderBottomWidth: 1
  },
  inningCounter: {
    position: 'absolute',
    top: 55,
    alignSelf: 'center',
    height: 30,
    width: 100,
    borderRadius: 15,
    borderWidth: 2,
    zIndex: 1
  },
  ballScoringContainer: {
    flexShrink: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    padding: 10
  },
  ballContainer: {
    flexShrink: 1
  },
  deadBallContainer: {
    flexShrink: 1,
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    padding: 15,
    justifyContent: 'flex-end'
  },
  deadBallIcon: {
    width: 40,
    height: 40,
    opacity: 0.7
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
  dialogActions: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10
  },
  playerBallTracker: {
    height: 32,
    display: 'flex',
    flexDirection: 'row',
  },
  playerBallBox: {
    flex: 1,
  },
  playerBallIconGroup: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    gap: 2,
    alignItems: 'center',
    borderStyle: 'solid',
    marginTop: 15,
    marginBottom: 5
  },
  playerBallIcon: {
    height: 20,
    width: 20
  },
  turnCta: {
    borderRadius: 19,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.5)'
  }
});
