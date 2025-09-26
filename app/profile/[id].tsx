import { Text } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { getPlayerById } from '@/dao/player.dao';
import Player from '@/models/player';

export default function UserProfile() {
  const [profile, setProfile] = useState<Player | null>(null);

  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();


  useEffect(() => {
    async function fetchPlayer(id: string) {
      const player = await getPlayerById(id);
      if (player) {
        setProfile(player);
        navigation.setOptions({ title: player.name });
      }
    }
    fetchPlayer(id);
  }, [navigation, id]);

  return <Text>User: {profile?.name}</Text>;
}
