import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import Player from '../../models/player';
import { Dialog, FAB, ListItem, Input } from '@rneui/themed';

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
    <ListItem>
      <ListItem.Content>
        <ListItem.Title>{player.name}</ListItem.Title>
        <ListItem.Subtitle>{player.skill8} 8ball, {player.skill9} 9ball</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  )
}

export function PlayerList() {
  const [isDialogVisible, setIsDialogVisible] = React.useState(false);

  const renderDialog = (setIsDialogVisible: React.Dispatch<React.SetStateAction<boolean>>) => {
    return (
      <Dialog
        isVisible={isDialogVisible}
        onBackdropPress={() => setIsDialogVisible(false)}
      >
        <Dialog.Title title='New Player'>
          <Text>Dialog Text</Text>
        </Dialog.Title>
        <Input
          label='Name'
          placeholder='Name'
        ></Input>
      </Dialog>
    );
  };

  const renderPlayerList = () => {
    return (
      <FlatList
        data={players}
        renderItem={({ item }) => renderRow(item)}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  return (
      <View>
        <FAB
          visible
          size="large"
          style={styles.fab}
          icon={{ name: 'add', color: 'white' }}
          color="green"
          onPress={() => setIsDialogVisible(true)}
        />
        {renderPlayerList()}
        {renderDialog(setIsDialogVisible)}
      </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 100
  }
});
