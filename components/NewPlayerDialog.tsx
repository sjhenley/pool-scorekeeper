import { Text, TextInput, View } from 'react-native';
import Player, { SkillLevel } from '@/models/player';
import React from 'react';
import { NumberSelector } from './NumberSelector';
import { Button } from './Button';
export interface PlayerDialogProps {
  /** Handler for creating a new player */
  onClose: (player?: Player) => void;
  /** Initial player data */
  player?: Player;
}

export const PlayerDialog = ({
  onClose,
  player
}: PlayerDialogProps) => {

  const [playerName, setPlayerName] = React.useState<string>('');
  const [skillEightBall, setSkillEightBall] = React.useState<SkillLevel>(3);
  const [skillNineBall, setSkillNineBall] = React.useState<SkillLevel>(3);
  const [nameError, setNameError] = React.useState<string>();

  React.useEffect(() => {
    if (player) {
      setPlayerName(player.name);
      setSkillEightBall(player.skill8);
      setSkillNineBall(player.skill9);
    }
  }, [player]);

  const onNameChange = (text: string) => {
    if (nameError && text.trim().length > 0) {
      setNameError(undefined);
    }
    setPlayerName(text);
  };

  const onSubmit = () => {
    if (playerName.trim().length === 0) {
      setNameError('Name is required');
      return;
    } else {
      setNameError(undefined);
    }

    if (player) {
      // Update the existing player object and pass it back
      player.name = playerName.trim();
      player.skill8 = skillEightBall;
      player.skill9 = skillNineBall;
      onClose(player);
    } else {
      // Return a new player object
      onClose(new Player(
        playerName.trim(),
        skillEightBall,
        skillNineBall
      ));
    }


  };

  return (
    <View className='flex gap-5'>
      <Text className={`text-primary text-4xl font-bold ${!nameError && 'mb-8'}`}>{player ? 'Edit Player' : 'New Player'}</Text>
      {nameError && <Text className='text-2xl font-sans text-red-500'>{nameError}</Text>}
      <View
        className='flex-col'>
        <Text className='text-primary text-2xl font-bold'>Name</Text>
        <TextInput
          autoCapitalize='words'
          value={playerName}
          inputMode='text'
          maxLength={75}
          placeholder='e.g. John Doe'
          onChangeText={onNameChange}
          className={`text-black text-2xl px-4 py-2 rounded-md bg-white border-2 focus:border-primary-500 focus:bg-primary-50 shadow-sm ${nameError ? 'border-red-500' : 'border-primary-200'}`}
        />
      </View>
      <View
        className='flex-col w-[60%]'>
        <Text className='text-primary text-2xl font-bold'>8-Ball Skill</Text>
        <NumberSelector
          min={2}
          max={7}
          initial={player?.skill8 ?? 3}
          onValueChange={(value) => setSkillEightBall(value as SkillLevel)}
        />
      </View>
      <View
        className='flex-col w-[60%]'>
        <Text className='text-primary text-2xl font-bold'>9-Ball Skill</Text>
        <NumberSelector
          min={1}
          max={9}
          initial={player?.skill9 ?? 3}
          onValueChange={(value) => setSkillNineBall(value as SkillLevel)}
        />
      </View>
      <View className='mt-12 flex-row gap-2'>
        <Button
          label='Cancel'
          primary={false}
          onPress={() => onClose()}
          containerClass='flex-1'
        />
        <Button
          label={player ? 'Update' : 'Create'}
          onPress={onSubmit}
          containerClass='flex-1'
        />
      </View>
    </View>
  );
};
