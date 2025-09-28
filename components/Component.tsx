import { View, Text } from 'react-native';

export interface ComponentProps {

}

export const Component = ({
  ...props
}: ComponentProps) => {
  return (
    <View>
      <Text>Component</Text>
    </View>
  );
};
