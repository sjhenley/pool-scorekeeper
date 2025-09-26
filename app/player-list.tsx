import { Button, Dialog, NewPlayerDialog } from '@/components';
import { PlayerCard } from '@/components/PlayerCard';
import Player from '@/models/player';
import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';

const players: Player[] = [
  new Player('Alex Johnson', 5, 6),
  new Player('Jordan Smith', 4, 5),
  new Player('Taylor Lee', 6, 7),
  new Player('Morgan Brown', 3, 4),
  new Player('Casey Davis', 7, 2),
  new Player('Riley Wilson', 2, 5),
  new Player('Jamie Clark', 6, 3),
  new Player('Drew Martinez', 5, 7),
  new Player('Quinn Lewis', 4, 6),
  new Player('Skyler Walker', 3, 5),
  new Player('Cameron Hall', 7, 6),
  new Player('Avery Allen', 2, 4),
  new Player('Peyton Young', 6, 2),
  new Player('Reese King', 5, 3),
  new Player('Rowan Wright', 4, 7),
  new Player('Sawyer Scott', 3, 6),
  new Player('Emerson Green', 7, 5),
  new Player('Finley Adams', 2, 3),
  new Player('Harper Baker', 6, 4),
  new Player('Dakota Nelson', 5, 2)
];

export default function PlayerList() {
  const [ newPlayerDialogShown, setNewPlayerDialogShown ] = React.useState(false);

  function onCreatePlayer(player: Player): void {
    // TODO
  }

  return (
    <View className='w-full h-full'>
      <Dialog
        isOpen={newPlayerDialogShown}
        onClose={() => setNewPlayerDialogShown(false)}
      >
        <NewPlayerDialog onCreate={onCreatePlayer} />
      </Dialog>
      <View className='flex-1 justify-center items-center bg-text-300 dark:bg-background-900 gap-5 pt-5'>

        <Button
          primary
          transparent
          size='md'
          icon='add'
          label="New Player"
          onPress={() => setNewPlayerDialogShown(true)}
        />
        <ScrollView className='w-full'>
          {
            players.map((player, idx) => (
              <PlayerCard key={'player-card' + player.id + idx} player={player} />
            ))
          }
        </ScrollView>
      </View>
    </View>

  );
}
