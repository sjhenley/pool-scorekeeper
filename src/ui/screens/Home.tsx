import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from '@rneui/themed';
import { useGlobalStyles } from '../../styles';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
const packageJson = require('../../../package.json');

interface HomeProps {
  navigation: NavigationProp<ParamListBase>;
}

export function Home({ navigation }: HomeProps) {
  const globalStyle = useGlobalStyles();

  return (
    <View style={globalStyle.container}>
      <View style={styles.body}>
        <Text style={styles.title}>Scorekeeper</Text>
        <Button title={'Start Game'} buttonStyle={globalStyle.buttonLarge} titleStyle={globalStyle.buttonPrimaryText} onPress={() => navigation.navigate('New Game')} />
        <Button title={'Players'} buttonStyle={globalStyle.buttonLarge} titleStyle={globalStyle.buttonPrimaryText} onPress={() => navigation.navigate('Players')} />
        <Button title={'Game History'} buttonStyle={globalStyle.buttonLarge} titleStyle={globalStyle.buttonPrimaryText} onPress={() => navigation.navigate('History')} />
      </View>
      <View style={styles.footer}>
        <Text style={globalStyle.textCenter}>Version v{packageJson.version}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
  footer: {
    flexShrink: 1,
    padding: 10
  },
  title: {
    fontSize: 48
  }
});