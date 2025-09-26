import { Text, TextInput, View } from 'react-native';
import Player, { SkillLevel } from '@/models/player';
import React from 'react';
import { NumberSelector } from './NumberSelector';
import { Button } from './Button';
export interface NewPlayerDialogProps {
  /** Handler for creating a new player */
  onClose: (player?: Player) => void;
}

export const NewPlayerDialog = ({
  onClose
}: NewPlayerDialogProps) => {

  const [playerName, setPlayerName] = React.useState<string>('');
  const [skillEightBall, setSkillEightBall] = React.useState<SkillLevel>(3);
  const [skillNineBall, setSkillNineBall] = React.useState<SkillLevel>(3);
  const [nameError, setNameError] = React.useState<string>();

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

    onClose(new Player(
      playerName.trim(),
      skillEightBall,
      skillNineBall
    ));
  };

  return (
    <View className='flex gap-5'>
      <Text className={`text-primary text-4xl font-bold ${!nameError && 'mb-8'}`}>New Player</Text>
      {nameError && <Text className='text-2xl font-sans text-red-500'>{nameError}</Text>}
      <View
        className='flex-col'>
        <Text className='text-primary text-2xl font-bold'>Name</Text>
        <TextInput
          autoCapitalize='words'
          maxLength={75}
          placeholder='e.g. John Doe'
          onChangeText={onNameChange}
          className={`text-primary text-2xl px-4 py-2 rounded-md bg-white border-2 focus:border-primary-500 focus:bg-primary-50 shadow-sm ${nameError ? 'border-red-500' : 'border-primary-200'}`}
        />
      </View>
      <View
        className='flex-col w-[60%]'>
        <Text className='text-primary text-2xl font-bold'>8-Ball Skill</Text>
        <NumberSelector
          min={2}
          max={7}
          initial={3}
          onValueChange={(value) => setSkillEightBall(value as SkillLevel)}
        />
      </View>
      <View
        className='flex-col w-[60%]'>
        <Text className='text-primary text-2xl font-bold'>9-Ball Skill</Text>
        <NumberSelector
          min={2}
          max={7}
          initial={3}
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
          label='Create'
          onPress={onSubmit}
          containerClass='flex-1'
          // disabled={playerName.trim().length === 0}
        />
      </View>
    </View>
  );
};
