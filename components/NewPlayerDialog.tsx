import { Text, TextInput, View } from 'react-native';
import Player, { SkillLevel } from '@/models/player';
import React from 'react';
import { NumberSelector } from './NumberSelector';
export interface NewPlayerDialogProps {
  /** Handler for creating a new player */
  onCreate: (player: Player) => void;
}

export const NewPlayerDialog = ({
  onCreate
}: NewPlayerDialogProps) => {

  const [playerName, setPlayerName] = React.useState<string>('');
  const [skillEightBall, setSkillEightBall] = React.useState<SkillLevel>(3);
  const [skillNineBall, setSkillNineBall] = React.useState<SkillLevel>(3);

  return (
    <View className='flex h-[80%] gap-5'>
      <Text className='text-primary text-4xl font-bold'>New Player</Text>
      <TextInput
        autoCapitalize='words'
        maxLength={75}
        placeholder='e.g. John Doe'
        onChangeText={setPlayerName}
        className='text-primary text-2xl border'
      />
      <View
        className='flex-col text-primaryjustify-between w-[50%]'>
        <Text className='text-primary text-2xl font-bold'>8-Ball Skill</Text>
        <NumberSelector
          min={2}
          max={7}
          initial={3}
          onValueChange={(value) => setSkillEightBall(value as SkillLevel)}
        />
      </View>

      <View
        className='flex-col text-primaryjustify-between w-[50%]'>
        <Text className='text-primary text-2xl font-bold'>9-Ball Skill</Text>
        <NumberSelector
          min={2}
          max={7}
          initial={3}
          onValueChange={(value) => setSkillNineBall(value as SkillLevel)}
        />
      </View>
    </View>
  );
};
