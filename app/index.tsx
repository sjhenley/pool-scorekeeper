import { Text, View, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
      className="bg-sky-200"
    >
      <Text className="text-xl font-bold text-blue-500">Edit app/index.tsx to edit this screen.</Text>
      <Button onPress={() => router.navigate('/storybook')} title="Go to Storybook" />
    </View>
  );
}
