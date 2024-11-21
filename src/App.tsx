import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Screens from './ui/screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Player from './models/player';
import { ThemeProvider, createTheme, useTheme } from '@rneui/themed';
import { COLORS, useGlobalStyles } from './styles';

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
  const globalStyles = useGlobalStyles();
  const theme = useTheme().theme;
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {          
          backgroundColor: theme.colors.background,
        },
        headerTitleStyle: {
          ...globalStyles.textLarge
        },
        headerTintColor: theme.colors.primary,
      }}
    >
      <Stack.Screen name="Home" component={Screens.Home} options={{ headerShown: false }}/>
      <Stack.Screen name="New Game" component={Screens.NewGame} />
      <Stack.Screen name="Players" component={Screens.PlayerList} />
      <Stack.Screen name="History" component={Screens.History} />
      <Stack.Screen name="Game" component={Screens.Game} />
    </Stack.Navigator>
  );
}

export default function App() {
  const theme = createTheme({
    lightColors: {
      primary: COLORS.light.primary,
      secondary: COLORS.light.secondary,
      background: COLORS.light.background,
    },
    darkColors: {
      primary: COLORS.dark.primary,
      secondary: COLORS.dark.secondary,
      background: COLORS.dark.background,
    },
    components: {
      Button: {
        raised: true,
      }
    },
    mode: 'dark'
  });

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
