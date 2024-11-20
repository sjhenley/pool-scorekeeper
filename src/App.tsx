import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Screens from './ui/screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Player from './models/player';

export type RootStackParamList = {
  Home: undefined,
  'New Game': undefined,
  Players: undefined,
  History: undefined,
  Game: {
    player1: Player,
    player2: Player,
    isEightBall: boolean
  }
}
const Stack = createStackNavigator<RootStackParamList>();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Screens.Home} options={{ headerShown: false }}/>
      <Stack.Screen name="New Game" component={Screens.NewGame} />
      <Stack.Screen name="Players" component={Screens.PlayerList} />
      <Stack.Screen name="History" component={Screens.History} />
      <Stack.Screen name="Game" component={Screens.Game} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
