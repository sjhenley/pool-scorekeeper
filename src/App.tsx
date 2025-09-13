import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Screens from './ui/screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Player from './models/player';
import { ThemeProvider, createTheme, useTheme } from '@rn-vui/themed';
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
      <Stack.Screen name="New Game" component={Screens.NewGame} options={{headerShown: false }}/>
      <Stack.Screen name="Players" component={Screens.PlayerList} />
      <Stack.Screen name="History" component={Screens.History} />
      <Stack.Screen name="Game" component={Screens.Game} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

function Root() {
  const globalStyles = useGlobalStyles();
  return (
    <View style={globalStyles.root}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </View>
  );
}

export default function App() {
  const theme = createTheme({
    lightColors: {
      primary: COLORS.light.primary,
      secondary: COLORS.light.secondary,
      background: COLORS.light.background,
      black: COLORS.light.black,
      white: COLORS.light.white,
      grey0: COLORS.light.grey0,
      grey1: COLORS.light.grey1,
      grey2: COLORS.light.grey2,
      success: COLORS.light.success,
      warning: COLORS.light.warning,
      error: COLORS.light.error
    },
    darkColors: {
      primary: COLORS.dark.primary,
      secondary: COLORS.dark.secondary,
      background: COLORS.dark.background,
      black: COLORS.dark.black,
      white: COLORS.dark.white,
      grey0: COLORS.dark.grey0,
      grey1: COLORS.dark.grey1,
      grey2: COLORS.dark.grey2,
      success: COLORS.dark.success,
      warning: COLORS.dark.warning,
      error: COLORS.dark.error
    },
    components: {
      Button: {
        raised: true,
      }
    },
    mode: 'dark'
  });

  return (
    <ThemeProvider theme={theme}>
      <Root />
    </ThemeProvider>
  );
}
