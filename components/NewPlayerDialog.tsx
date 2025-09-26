import { Text, TouchableOpacity, View } from 'react-native';
import { StyledMaterialIcon } from './StyledMaterialIcon';
import Player from '@/models/player';


export interface NewPlayerDialogProps {
  /** Handler for creating a new player */
  onCreate: (player: Player) => void;
}

export const NewPlayerDialog = ({
  onCreate
}: NewPlayerDialogProps) => {

  return (
    <View className='flex w-screen h-[80%] gap-5'>
      <Text className='text-primary text-4xl font-bold'>New Player</Text>
    </View>
  );
};
