import React, { useRef } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import Player, { SkillLevel } from '../../models/player';
import { Dialog, FAB, ListItem, Input } from '@rneui/themed';
import {Picker} from '@react-native-picker/picker';
import { loadPlayerList, savePlayerList } from '@app/util/storage.util';
import { Pressable } from 'react-native-gesture-handler';

function loadPlayers(callback: React.Dispatch<React.SetStateAction<Player[]>>) {
  loadPlayerList().then((players) => {
    callback(players);
  });
}

export function PlayerList() {
  const [isDialogVisible, setIsDialogVisible] = React.useState<boolean>(false);
  const [dialogErr, setDialogErr] = React.useState<string>('');
  const [isUpdatePlayer, setIsUpdatePlayer] = React.useState<boolean>(false);

  const [playerList, setPlayerList] = React.useState<Player[]>([]);

  const [playerName, setPlayerName] = React.useState<string>('');
  const [skill8, setSkill8] = React.useState<SkillLevel>(3);
  const [skill9, setSkill9] = React.useState<SkillLevel>(3);

  function addPlayer(name: string, skill8: SkillLevel, skill9: SkillLevel) {
    const newPlayer = new Player(name, skill8, skill9);
    setPlayerList([...playerList, newPlayer]);
    savePlayerList([...playerList, newPlayer]);
    closeDialog();
  }

  function updatePlayer(name: string, skill8: SkillLevel, skill9: SkillLevel) {
    const updatedPlayerList = playerList.map(player => {
      if (player.name === name) {
        player.skill8 = skill8;
        player.skill9 = skill9;
      }
      return player;
    });
    setPlayerList(updatedPlayerList);
    savePlayerList(updatedPlayerList);
    closeDialog();
  }

  function deletePlayer(name: string) {
    const updatedPlayerList = playerList.filter(player => player.name !== name);
    setPlayerList(updatedPlayerList);
    savePlayerList(updatedPlayerList);
    closeDialog();
  }

  function openDialog(player?: Player) {
    if (player) {
      setIsUpdatePlayer(true);
      setPlayerName(player.name);
      setSkill8(player.skill8);
      setSkill9(player.skill9);
    } else {
      setIsUpdatePlayer(false);
    }
    setIsDialogVisible(true);
  }

  function closeDialog() {
    // reset state
    setPlayerName('');
    setDialogErr('');
    setSkill8(3);
    setSkill9(3);
    setIsDialogVisible(false);
  }

  const renderDialogActions = () => {
    if (isUpdatePlayer) {
      return (
        <Dialog.Actions>
          <Dialog.Button title="Update" onPress={() => updatePlayer(playerName, skill8, skill9)}/>
          <Dialog.Button title="Delete" titleStyle={{color: 'red'}} onPress={() => deletePlayer(playerName)}/>
        </Dialog.Actions>
      );
    } else {
      return (
        <Dialog.Actions>
          <Dialog.Button title="Add" onPress={() => addPlayer(playerName, skill8, skill9)}/>
        </Dialog.Actions>
      );
    }
  }

  const renderDialog = () => {
    const nameInput = React.useRef(0 as any);
    
    const pickerItems = [];
    for (let i = 1; i <= 9; i++) {
      pickerItems.push(<Picker.Item key={i} label={i.toString()} value={i} />);
    }

    function submit(name: string, skill8: SkillLevel, skill9: SkillLevel) {
      if (isUpdatePlayer) {
        updatePlayer(name, skill8, skill9);
        return;
      }
      let err = false;
      if (!name) {
        setDialogErr('Name is required');
        err = true;
      } else if (playerList.find(p => p.name === name)) {
        setDialogErr('Name is already taken');
        err = true;
      }

      if (err && nameInput) {
        nameInput.current.shake();
      } else {
        addPlayer(name, skill8, skill9);
      }
    }
    return (
      <Dialog
        isVisible={isDialogVisible}
        onBackdropPress={() => closeDialog()}
      >
        <Dialog.Title title={isUpdatePlayer ? 'Update Player' : 'New Player'}>
          <Text>Dialog Text</Text>
        </Dialog.Title>
        <Text style={styles.error}>{dialogErr}</Text>
        <Input
          placeholder='Name'
          onChangeText={setPlayerName}
          value={playerName}
          ref={nameInput}
          disabled={isUpdatePlayer}
        ></Input>
        <View style={styles.pickerRow}>
          <Text style={styles.pickerLabel}>8 Ball SR</Text>
          <Picker
            selectedValue={skill8}
            style={styles.picker}
            onValueChange={(itemValue) =>
              setSkill8(itemValue)
            }>
            {pickerItems}
          </Picker>
        </View>
        <View style={styles.pickerRow}>
          <Text style={styles.pickerLabel}>9 Ball SR</Text>
          <Picker
            selectedValue={skill9}
            style={styles.picker}
            onValueChange={(itemValue) =>
              setSkill9(itemValue)
            }>
            {pickerItems}
          </Picker>
        </View>
        
        {renderDialogActions()}
      </Dialog>
    );
  };

  function renderRow(player: Player) {
    return (
      <Pressable onPress={() => openDialog(player)}>
        <ListItem>
          <ListItem.Content>
            <ListItem.Title>{player.name}</ListItem.Title>
            <ListItem.Subtitle>{player.skill8} 8ball, {player.skill9} 9ball</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      </Pressable>
    )
  }

  const renderPlayerList = () => {
    loadPlayers(setPlayerList);
    return (
      <FlatList
        data={playerList}
        renderItem={({ item }) => renderRow(item)}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  return (
      <View style={{height: '100%'}}>
        <FAB
          visible
          size="large"
          style={styles.fab}
          icon={{ name: 'add', color: 'white' }}
          color="green"
          onPress={() => openDialog()}
        />
        {renderPlayerList()}
        {renderDialog()}
      </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 100
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
  error: {
    color: 'red'
  }
});
