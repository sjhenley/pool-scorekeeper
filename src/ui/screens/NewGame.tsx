import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Tab, TabView, Button, useTheme } from '@rneui/themed';
import Player from '@app/models/player';
import { loadPlayerList } from '@app/util/storage.util';
import { Picker } from '@react-native-picker/picker';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useGlobalStyles } from '@app/styles';


interface NewGameProps {
  navigation: NavigationProp<ParamListBase>;
}

export function NewGame({ navigation }: NewGameProps) {
  const globalStyle = useGlobalStyles();
  const theme = useTheme().theme;

  const [tabIndex, setTabIndex] = React.useState(0);

  const [playerList, setPlayerList] = React.useState<Player[]>([]);
  const [player1, setPlayer1] = React.useState<Player>();
  const [player2, setPlayer2] = React.useState<Player>();

  React.useEffect(() => {
    loadPlayerList().then((players) => {
      setPlayerList(players);
      setPlayer1(players[0]);
      setPlayer2(players[1]);
    });
  }, []);

  function isEightBall(): boolean {
    return tabIndex === 0;
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

  function renderPlayerList() {
    return (
      <>
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
      </>
    );
  }

  function startGame() {
    navigation.navigate('Game', {
      player1,
      player2,
      isEightBall: isEightBall()
    });
  }

  return (
    <View style={[globalStyle.container, { paddingBottom: 30 }]}>
      <Tab
        value={tabIndex}
        onChange={setTabIndex}
        indicatorStyle={{
          backgroundColor: theme.colors.background,
          height: 5
        }}
      >
        <Tab.Item
          title="8 Ball"
          titleStyle={[globalStyle.background, globalStyle.textLarge]}
          containerStyle={{ backgroundColor: tabIndex ? theme.colors.grey0 : theme.colors.grey1 }}
        />
        <Tab.Item
          title="9 Ball"
          titleStyle={[globalStyle.background, globalStyle.textLarge]}
          containerStyle={{ backgroundColor: tabIndex ? theme.colors.grey1 : theme.colors.grey0 }}
        />
      </Tab>

      <TabView containerStyle={[{ width: '100%' }, globalStyle.container]} value={tabIndex} onChange={setTabIndex} animationType='spring'>
        <TabView.Item style={{ width: '100%' }}>
          {renderPlayerList()}
        </TabView.Item>
        <TabView.Item style={{ width: '100%' }}>
          {renderPlayerList()}
        </TabView.Item>
      </TabView>

      <Button
        title={'Start Game'}
        buttonStyle={globalStyle.buttonLarge}
        titleStyle={globalStyle.buttonPrimaryText}
        containerStyle={styles.buttonContainer}
        onPress={startGame}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pickerRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20
  },
  pickerLabel: {
    flexGrow: 1
  },
  picker: {
    flexGrow: 2
  },
  buttonContainer: {
    display: 'flex',
    marginHorizontal: 50,
    marginVertical: 10
  }
});
