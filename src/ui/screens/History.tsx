import React from 'react';
import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { useGlobalStyles } from '../../styles';

export function History() {
  const globalStyle = useGlobalStyles();
  return (
    <View style={globalStyle.container}>
      <Text h1 style={globalStyle.textCenter}>History</Text>
    </View>
  );
}
