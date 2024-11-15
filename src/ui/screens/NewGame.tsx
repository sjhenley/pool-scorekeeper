import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Tab, TabView, Button } from '@rneui/themed'
import Player from '@app/models/player';
import { loadPlayerList } from '@app/util/storage.util';
import { Picker } from '@react-native-picker/picker';

export function NewGame() {
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
          <Text style={styles.pickerLabel}>Player 1</Text>
          <Picker
            prompt='Player 1'
            selectedValue={player1}
            style={styles.picker}
            onValueChange={(itemValue) =>
              setPlayer1(itemValue)
            }>
            {renderPickerItems()}
          </Picker>
        </View>
        <View style={styles.pickerRow}>
          <Text style={styles.pickerLabel}>Player 2</Text>
          <Picker
            prompt='Player 2'
            selectedValue={player2}
            style={styles.picker}
            onValueChange={(itemValue) =>
              setPlayer2(itemValue)
            }>
            {renderPickerItems()}
          </Picker>
        </View>
      </>
    )
  }

  return (
    <>
      <Tab
        value={tabIndex}
        onChange={setTabIndex}
        indicatorStyle={styles.tabIndicator}
      >
        <Tab.Item
          title="8 Ball"
          titleStyle={{ fontSize: 12 }}
        />
        <Tab.Item
          title="9 Ball"
          titleStyle={{ fontSize: 12 }}
        />
      </Tab>

      <TabView containerStyle={{width: '100%'}} value={tabIndex} onChange={setTabIndex} animationType='spring'>
        <TabView.Item style={{width: '100%'}}>
          {renderPlayerList()}
        </TabView.Item>
        <TabView.Item style={{width: '100%'}}>
          {renderPlayerList()}
        </TabView.Item>
      </TabView>

      <Button title={'Start Game'} containerStyle={styles.buttonContainer}  />
    </>
  );
}

const styles = StyleSheet.create({
  tabIndicator: {
    backgroundColor: 'white',
    height: 3
  },
  pickerRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerLabel: {
    flexGrow: 1,
    fontWeight: 'bold'
  },
  picker: {
    flexGrow: 1,
  },
  buttonContainer: {
    display: 'flex',
    marginHorizontal: 50,
    marginVertical: 10,
  }
});
