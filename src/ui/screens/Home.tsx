import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Switch, useTheme, useThemeMode } from '@rneui/themed';
import { useGlobalStyles } from '../../styles';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
const packageJson = require('../../../package.json');

interface HomeProps {
  navigation: NavigationProp<ParamListBase>;
}

export function Home({ navigation }: HomeProps) {
  const globalStyle = useGlobalStyles();
  const themeMode = useThemeMode();
  const theme = useTheme().theme;

  return (
    <View style={globalStyle.container}>
      <View style={styles.viewModeToggleContainer}>
        <Ionicons name="moon" size={27} color={theme.colors.primary} />
        <Switch 
          value={themeMode.mode === 'dark'}
          onValueChange={(value) => themeMode.setMode(value ? 'dark' : 'light')}
          style={styles.viewModeToggleSwitch}
          trackColor={{ false: theme.colors.primary, true: theme.colors.primary }}
        />
      </View>
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
  },
  viewModeToggleContainer: {
    position: 'absolute',
    top: 30,
    right: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  viewModeToggleIcon: {

  },
  viewModeToggleSwitch: {
    transform: [
      { scaleX:  1.5 }, 
      { scaleY:  1.5 }
    ]
  }
});