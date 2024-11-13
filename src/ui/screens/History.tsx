import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-ui-lib';
import { style } from '../../styles';

export function History() {
  return (
    <View style={style.container}>
      <Text black heading centered style={style.textCenter}>Game History</Text>
    </View>
  );
}
