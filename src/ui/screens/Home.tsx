import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-ui-lib';
import { style } from '../../styles';

export function Home() {
  return (
    <View style={style.container}>
      <Text primary heading centered style={style.textCenter}>Open up App.tsx to start working on your app!</Text>
    </View>
  );
}
