import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme, ButtonGroup } from '@rn-vui/themed';
import Player from '@app/models/player';
import { loadPlayerList } from '@app/util/storage.util';
import { Picker } from '@react-native-picker/picker';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useGlobalStyles } from '@app/styles';
import { Alert, AlertType } from '@app/models/alert.model';
import { AlertView } from '@components/AlertView';

interface NewGameProps {
  navigation: NavigationProp<ParamListBase>;
}

export function NewGame({ navigation }: NewGameProps) {
  const globalStyle = useGlobalStyles();
  const theme = useTheme().theme;

  const [selectedGame, setSelectedGame] = React.useState(0);

  const [playerList, setPlayerList] = React.useState<Player[]>([]);
  const [player1, setPlayer1] = React.useState<Player>();
  const [player2, setPlayer2] = React.useState<Player>();

  const [alerts, setAlerts] = React.useState<Alert[]>([]);

  React.useEffect(() => {
    loadPlayerList().then((players) => {
      setPlayerList(players);
      setPlayer1(players[0]);
      setPlayer2(players[1]);
    });
  }, []);

  function isEightBall(): boolean {
    return selectedGame === 0;
  }

  function renderPickerItems() {
    return playerList.map((player) => {
      return (
        <Picker.Item
          key={player.name}
          style={globalStyle.textMedium}
          label={`${player.name} - ${isEightBall() ? player.skill8 : player.skill9}`}
          value={player}
        />
      );
    });
  }

  function startGame(): void {
    const alert = {
      type: AlertType.ERROR,
      message: ''
    };

    const newAlerts: Alert[] = []; // alerts to display after running validation

    if (!player1 || !player2) {
      alert.message = 'Select 2 players to start';
      newAlerts.push(alert);
    } else if (player1.name === player2.name) {
      alert.message = 'Select 2 different players to start';
      newAlerts.push(alert);
    }

    setAlerts(newAlerts);

    if (newAlerts.length === 0) { 
      navigation.navigate('Game', {
        player1,
        player2,
        isEightBall: isEightBall()
      });
    }
  }

  return (
    <View style={[globalStyle.container, styles.container]}>
      <Text style={[styles.title, globalStyle.primary]}>New Game</Text>
      <View style={styles.pickerContainer}>
        <View style={styles.pickerRow}>
          <Text style={[globalStyle.textMedium, globalStyle.primary, styles.pickerLabel, globalStyle.bold]}>Game Type</Text>
          <ButtonGroup
            buttons={['8-Ball', '9-Ball']}
            containerStyle={[styles.picker, styles.gameOptionContainer, { backgroundColor: theme.colors.grey2, borderColor: theme.colors.grey2 }]}
            buttonStyle={[{ backgroundColor: theme.colors.background }]}
            selectedButtonStyle={[{ backgroundColor: theme.colors.grey2 }]}
            textStyle={[globalStyle.textMedium, globalStyle.primary]}
            innerBorderStyle={{color: theme.colors.grey2}}
            selectedIndex={selectedGame}
            onPress={setSelectedGame}
          />
        </View>
        <View style={styles.pickerRow}>
          <Text style={[globalStyle.textMedium, globalStyle.primary, styles.pickerLabel, globalStyle.bold]}>Player 1</Text>
          <Picker
            prompt='Player 1'
            selectedValue={player1}
            style={[globalStyle.primary, styles.picker]}
            onValueChange={(itemValue) => setPlayer1(itemValue) }>
            {renderPickerItems()}
          </Picker>
        </View>
        <View style={styles.pickerRow}>
          <Text style={[globalStyle.textMedium, globalStyle.primary, styles.pickerLabel, globalStyle.bold]}>Player 2</Text>
          <Picker
            prompt='Player 2'
            selectedValue={player2}
            style={[globalStyle.primary, styles.picker]}
            onValueChange={(itemValue) => setPlayer2(itemValue) }>
            {renderPickerItems()}
          </Picker>
        </View>
      </View>

      <AlertView alerts={alerts}></AlertView>

      <Button
        title={'Start Game'}
        type='clear'
        containerStyle={[{backgroundColor: theme.colors.grey2}, styles.startGame]}
        buttonStyle={[globalStyle.buttonLarge, styles.startGame]}
        titleStyle={[globalStyle.textLarge, globalStyle.primary]}
        onPress={startGame}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingVertical: 100,
    paddingHorizontal: 20
  },
  pickerContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignSelf: 'center',
    flex: 3
  },
  pickerRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5
  },
  pickerLabel: {
    flex: 1
  },
  picker: {
    flex: 2
  },
  buttonContainer: {
    display: 'flex',
    marginHorizontal: 50,
    marginVertical: 10
  },
  gameOptionContainer: {
    borderWidth: 2,
    height: 60
  },
  startGame: {
    borderRadius: 19,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.5)'
  },
  title: {
    fontSize: 48,
    flex: 1
  }
});
