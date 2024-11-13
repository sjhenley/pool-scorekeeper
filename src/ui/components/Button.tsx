import React from 'react';
import { Button as LibButton} from 'react-native-ui-lib';
import { COLORS, style } from '../../styles';

type ButtonProps = {
  label: string;
  onPress: (props: any) => void;
}

export function Button(props: ButtonProps) {
  return (
    <LibButton label={props.label} color={COLORS.black} style={style.buttonPrimary} onPress={props.onPress}/>
  );
}
