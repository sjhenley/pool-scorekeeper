import React from 'react';
import { Typography, Colors } from 'react-native-ui-lib';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Screens from './ui/screens';
import { COLORS, TYPOGRAPHY } from './styles';

const Stack = createStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Screens.Home} options={{ headerShown: false }}/>
      <Stack.Screen name="New Game" component={Screens.NewGame} />
      <Stack.Screen name="Players" component={Screens.PlayerList} />
      <Stack.Screen name="History" component={Screens.History} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}

Colors.loadColors(COLORS);

Typography.loadTypographies(TYPOGRAPHY);
