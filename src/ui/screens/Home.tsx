import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-ui-lib';
import { Button } from '../components/Button';
import { style } from '../../styles';

import { NavigationProp } from '@react-navigation/native';

interface HomeProps {
  navigation: NavigationProp<any>;
}

export function Home({ navigation }: HomeProps) {
  return (
    <View style={style.container}>
      <Text black heading centered style={style.textCenter}>Scorekeeper</Text>
      <Button label="Start Game" onPress={() => navigation.navigate('New Game')}/>
      <Button label="Players" onPress={() => navigation.navigate('Players')}/>
      <Button label="Game History" onPress={() => navigation.navigate('History')}/>
    </View>
  );
}
