import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from '@rneui/themed';
import { style } from '../../styles';
import { NavigationProp } from '@react-navigation/native';

interface HomeProps {
  navigation: NavigationProp<any>;
}

export function Home({ navigation }: HomeProps) {
  return (
    <View style={style.container}>
      <Text h1 style={style.textCenter}>Scorekeeper</Text>
      <Button title={'Start Game'} containerStyle={styles.buttonContainer} onPress={() => navigation.navigate('New Game')} />
      <Button title={'Players'} containerStyle={styles.buttonContainer} onPress={() => navigation.navigate('Players')} />
      <Button title={'Game History'} containerStyle={styles.buttonContainer} onPress={() => navigation.navigate('History')} />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 200,
    marginHorizontal: 50,
    marginVertical: 10,
  }
});
