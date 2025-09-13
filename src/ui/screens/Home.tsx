import React from 'react';
import { View, StyleSheet, Alert, BackHandler } from 'react-native';
import { Button, Text, Switch, useTheme, useThemeMode } from '@rn-vui/themed';
import { useGlobalStyles } from '../../styles';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { loadPlayerList } from '@app/util/storage.util';
const packageJson = require('../../../package.json');

interface HomeProps {
  navigation: NavigationProp<ParamListBase>;
}

export function Home({ navigation }: HomeProps) {
  const globalStyle = useGlobalStyles();
  const themeMode = useThemeMode();
  const theme = useTheme().theme;

  React.useEffect(() => {
    const onBackPress = () => {
      Alert.alert(
        'Exit App',
        'Do you want to exit?',
        [
          {
            text: 'Cancel',
            onPress: () => {
              // Do nothing
            },
            style: 'cancel',
          },
          { text: 'YES', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      );
  
      return true;
    };
  
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );
  
    return () => backHandler.remove();
  }, []);

  async function onPressNewGame(): Promise<void> {
    return loadPlayerList().then((players) => {
      if (players.length >= 2) {
        return navigation.navigate('New Game');
      }

      Alert.alert(
        'Not enough players',
        'At least 2 players are required to start a match. Go to players list?',
        [
          { text: 'No', style: 'cancel', onPress: () => {} },
          { text: 'Yes', onPress: () => navigation.navigate('Players') }
        ]
      );
    });
  }

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
        <Button title={'Start Game'} buttonStyle={globalStyle.buttonLarge} titleStyle={[globalStyle.textLarge, globalStyle.background]} onPress={() => onPressNewGame()} />
        <Button title={'Players'} buttonStyle={globalStyle.buttonLarge} titleStyle={[globalStyle.textLarge, globalStyle.background]} onPress={() => navigation.navigate('Players')} />
        <Button title={'Game History'} buttonStyle={globalStyle.buttonLarge} titleStyle={[globalStyle.textLarge, globalStyle.background]} onPress={() => navigation.navigate('History')} />
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