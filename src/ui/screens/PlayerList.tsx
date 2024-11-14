import React from 'react';
import { StyleSheet, Alert, FlatList } from 'react-native';
import { BorderRadiuses, Colors, ListItem, Text, Button, Dialog, View } from 'react-native-ui-lib';
import Player from '../../models/player';

const plusIcon = require('@assets/icons/add.png');
let isNewPlayerDialogVisible = false;

const players = [
  new Player('John', 8, 9),
  new Player('Jake', 3, 2),
  new Player('Jane', 4, 5),
  new Player('John', 8, 9),
  new Player('Jake', 3, 2),
  new Player('Jane', 4, 5),
  new Player('John', 8, 9),
  new Player('Jake', 3, 2),
  new Player('Jane', 4, 5),
  new Player('John', 8, 9),
  new Player('Jake', 3, 2),
  new Player('Jane', 4, 5),
  new Player('John', 8, 9),
  new Player('Jake', 3, 2),
  new Player('Jane', 4, 5),
  new Player('John', 8, 9),
  new Player('Jake', 3, 2),
  new Player('Jane', 4, 5),
]

function renderRow(player: Player) {
  return (
    <View>
      <ListItem
        activeBackgroundColor={Colors.grey60}
        activeOpacity={0.3}
        height={77.5}
        onPress={() => Alert.alert(`pressed on ${player.name}`)}
      >
        <ListItem.Part middle column containerStyle={[styles.border, {paddingRight: 17}]}>
          <ListItem.Part containerStyle={{marginBottom: 3}}>
            <Text grey10 text70 style={{flex: 1, marginRight: 10}} numberOfLines={1}>
              {player.name}
            </Text>
            <Text grey10 text70 style={{marginTop: 2}}>
              {player.skill8}
            </Text>
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>
    </View>
  );
}

export function PlayerList() {
  const [isDialogVisible, setIsDialogVisible] = React.useState(false);

  const renderDialog = (setIsDialogVisible: React.Dispatch<React.SetStateAction<boolean>>) => {
    return (
      <Dialog
        top={true}
        visible={isDialogVisible}
        onDismiss={() => setIsDialogVisible(false)}
        containerStyle={styles.dialog}
      >
        <Text primary>Dialog2</Text>
      </Dialog>
    );
  };

  return (
    <View flex padding-12>
      
      {/* <FlatList 
        data={players}
        renderItem={({item}) => renderRow(item)}
      /> */}
      <Button round iconSource={plusIcon} style={styles.newPlayer} onPress={() => setIsDialogVisible(true)}/>
      
      {renderDialog(setIsDialogVisible)}

    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 54,
    height: 54,
    borderRadius: BorderRadiuses.br20,
    marginHorizontal: 14
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey70
  },
  newPlayer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: 'lightgreen',
    width: 75,
    height: 75
  },
  dialog: {
    backgroundColor: 'blue',
    marginBottom: 20,
    borderRadius: 12,
    position: 'absolute',
    top: 100,
    right: 0,
    width: 500,
    height: 500
  },
});
