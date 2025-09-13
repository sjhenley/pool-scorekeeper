import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import Player, { SkillLevel } from '../../models/player';
import { Dialog, FAB, ListItem, Input, useTheme } from '@rn-vui/themed';
import { Picker } from '@react-native-picker/picker';
import { loadPlayerList, savePlayerList } from '@app/util/storage.util';
import { formatTitleString } from '@app/util/string.util';
import { useGlobalStyles } from '@app/styles';

function loadPlayers(callback: React.Dispatch<React.SetStateAction<Player[]>>) {
  loadPlayerList().then((players) => {
    callback(players);
  });
}

export function PlayerList() {
  const globalStyle = useGlobalStyles();
  const theme = useTheme().theme;

  const [isDialogVisible, setIsDialogVisible] = React.useState<boolean>(false);
  const [dialogErr, setDialogErr] = React.useState<string>('');
  const [isUpdatePlayer, setIsUpdatePlayer] = React.useState<boolean>(false);

  const [playerList, setPlayerList] = React.useState<Player[]>([]);

  const [playerName, setPlayerName] = React.useState<string>('');
  const [skill8, setSkill8] = React.useState<SkillLevel>(3);
  const [skill9, setSkill9] = React.useState<SkillLevel>(3);

  function addPlayer(name: string, skill8: SkillLevel, skill9: SkillLevel) {
    const newPlayer = new Player(formatTitleString(name), skill8, skill9);
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

  const renderDialog = () => {
    const nameInput = React.useRef<any>(null);

    const pickerItems = [];
    for (let i = 1; i <= 9; i++) {
      pickerItems.push(<Picker.Item style={globalStyle.textMedium} key={i} label={i.toString()} value={i} />);
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
        nameInput.current?.shake();
      } else {
        addPlayer(name, skill8, skill9);
      }
    }

    const renderDialogActions = () => {
      if (isUpdatePlayer) {
        return (
          <Dialog.Actions>
            <View style={ styles.dialogActions }>
              <Dialog.Button 
                buttonStyle={globalStyle.buttonMedium}
                containerStyle={globalStyle.buttonPrimary}
                titleStyle={globalStyle.textMedium}
                title="Update"
                onPress={() => updatePlayer(playerName, skill8, skill9)}
              />
              <Dialog.Button
                buttonStyle={globalStyle.buttonMedium}
                containerStyle={globalStyle.buttonError}
                titleStyle={globalStyle.textMedium}
                title="Delete"
                onPress={() => deletePlayer(playerName)}
              />
            </View>
          </Dialog.Actions>
        );
      } else {
        return (
          <Dialog.Actions>
            <Dialog.Button
              buttonStyle={globalStyle.buttonMedium}
              containerStyle={globalStyle.buttonPrimary}
              titleStyle={globalStyle.textMedium}
              title="Add"
              onPress={() => submit(playerName, skill8, skill9)}
            />
          </Dialog.Actions>
        );
      }
    };

    return (
      <Dialog
        isVisible={isDialogVisible}
        onBackdropPress={() => closeDialog()}
        overlayStyle={globalStyle.dialog}
        style={globalStyle.dialog}
      >
        <Dialog.Title titleStyle={[globalStyle.background, globalStyle.textLarge]} title={isUpdatePlayer ? 'Update Player' : 'New Player'} />
        <Text style={[styles.pickerLabel, globalStyle.background, globalStyle.textMedium]}>Name</Text>
        <Input
          labelStyle={[globalStyle.background, globalStyle.textMedium]}
          inputStyle={[globalStyle.input, globalStyle.textMedium]}
          errorStyle={globalStyle.textSmall}
          disabledInputStyle={{ opacity: 0.7, fontWeight: 'bold' }}
          errorMessage={dialogErr}
          placeholder='e.g. "John Smith"'
          onChangeText={setPlayerName}
          value={playerName}
          ref={nameInput}
          disabled={isUpdatePlayer}
        ></Input>
        <View style={styles.pickerRow}>
          <Text style={[styles.pickerLabel, globalStyle.background, globalStyle.textMedium]}>8 Ball SR</Text>
          <Picker
            selectedValue={skill8}
            style={styles.picker}
            prompt='Select 8 Ball Skill Level'
            onValueChange={setSkill8}
          >
            {pickerItems}
          </Picker>
        </View>
        <View style={styles.pickerRow}>
          <Text style={[styles.pickerLabel, globalStyle.background, globalStyle.textMedium]}>9 Ball SR</Text>
          <Picker
            selectedValue={skill9}
            style={styles.picker}
            itemStyle={globalStyle.textLarge}
            prompt='Select 9 Ball Skill Level'
            onValueChange={setSkill9}
          >
            {pickerItems}
          </Picker>
        </View>
        {renderDialogActions()}
      </Dialog>
    );
  };

  function renderRow(player: Player) {
    return (
        <ListItem onPress={() => openDialog(player)} containerStyle={[styles.playerListItem, { backgroundColor: theme.colors.primary}]}>
          <ListItem.Content style={styles.playerListItemContent}>
            <ListItem.Title style={[globalStyle.textExtraLarge, styles.playerListItemTitle, { color: theme.colors.background  }]}>{player.name}</ListItem.Title>
            <View style={styles.scoreIndicator}>
              <Image source={require('@assets/balls/8.png')} style={{ width: 50, height: 50 }} />
              <Text style={[globalStyle.textLarge, { color: theme.colors.background  }]}>{player.skill8}</Text>
            </View>
            <View style={styles.scoreIndicator}>
              <Image source={require('@assets/balls/9.png')} style={{ width: 50, height: 50 }} />
              <Text style={[globalStyle.textLarge, { color: theme.colors.background  }]}>{player.skill9}</Text>
            </View>
          </ListItem.Content>
        </ListItem>
    );
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
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FAB
        visible
        size="large"
        style={styles.fab}
        icon={{ name: 'add', color: 'white' }}
        color={theme.colors.secondary}
        onPress={() => openDialog()}
      />
      {renderPlayerList()}
      {renderDialog()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  playerListItem: {
    borderRadius: 15,
    boxShadow: '20px 20px 10px rgba(0, 0, 0, 0.1)',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  playerListItemTitle: {
    flexGrow: 1
  },
  playerListItemContent: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20
  },
  scoreIndicator: {
    flexShrink: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    zIndex: 100,
    transform: [
      { scaleX:  1.5 }, 
      { scaleY:  1.5 }
    ],
    boxShadow:  '9px 9px 28px #293a43, -9px -9px 28px #4f7081'
  },
  pickerRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  pickerLabel: {
    flexGrow: 1,
    fontWeight: 'bold'
  },
  picker: {
    flexGrow: 1
  },
  dialogActions: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10
  }
});
