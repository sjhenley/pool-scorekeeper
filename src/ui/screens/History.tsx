import React from 'react';
import { View } from 'react-native';
import { Text } from '@rneui/themed'
import { style } from '../../styles';

export function History() {
  return (
    <View style={style.container}>
      <Text h1 style={style.textCenter}>History</Text>
    </View>
  );
}
