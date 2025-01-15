import { Alert } from '@app/models/alert.model';
import { View, StyleSheet } from 'react-native';
import { useGlobalStyles } from '@app/styles';
import { Text } from '@rneui/themed';

interface AlertViewProps {
  alerts: Alert[];
}

export function AlertView( { alerts }: AlertViewProps ) {
  const globalStyle = useGlobalStyles();

  if (alerts.length === 0) {
    return null;
  }

  return <View style={[styles.alertContainer, globalStyle.containerError]}>
    {alerts.map((alert) => <Text style={[globalStyle.textSmall, globalStyle.black]}>{alert.message}</Text>)}
  </View>
}

const styles = StyleSheet.create({
  alertContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 10,
    borderRadius: 5,
    width: '80%',
  }
});
