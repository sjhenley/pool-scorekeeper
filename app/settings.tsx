import { useRouter } from 'expo-router';
import { colorScheme } from 'nativewind';
import { useState } from 'react';
import { View } from 'react-native';
import { Button, Dialog } from '@/components';
import { clearAllPlayers, putPlayer } from '@/dao/player.dao';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { getPlayerTestData } from '@/util/test.util';

export default function Settings() {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>(colorScheme.get() || 'system');
  const [confirmClearPlayerDataDialogVisible, setConfirmClearPlayerDataDialogVisible] = useState<boolean>(false);
  const [confirmClearAllDataDiaglogVisible, setConfirmClearAllDataDialogVisible] = useState<boolean>(false);
  const [createTestDataDialogVisible, setCreateTestDataDialogVisible] = useState<boolean>(false);

  const router = useRouter();

  const setColorScheme = (scheme: 'light' | 'dark' | 'system') => {
    colorScheme.set(scheme);
    setCurrentTheme(scheme);
  };

  async function onClearPlayerDataConfirm(confirmed: boolean): Promise<void> {
    setConfirmClearPlayerDataDialogVisible(false);
    if (confirmed) {
      await clearAllPlayers();
    }
  }

  async function onClearAllDataConfirm(confirmed: boolean): Promise<void> {
    setConfirmClearAllDataDialogVisible(false);
    if (confirmed) {
      await AsyncStorage.clear();
    }
  }

  async function onCreateTestDataConfirm(confirmed: boolean): Promise<void> {
    setCreateTestDataDialogVisible(false);
    if (confirmed) {
      const data = getPlayerTestData(5);
      for (const player of data) {
        await putPlayer(player);
      }
    }
  }

  return (
    <View className='w-full h-full'>
      <Dialog
        isOpen={confirmClearPlayerDataDialogVisible}
        onClose={() => setConfirmClearPlayerDataDialogVisible(false)}
      >
        <ConfirmDialog
          onClose={onClearPlayerDataConfirm}
          header='Clear Player Data'
          message='Are you sure you want to delete all player data? This action cannot be undone.'
        />
      </Dialog>
      <Dialog
        isOpen={confirmClearAllDataDiaglogVisible}
        onClose={() => setConfirmClearAllDataDialogVisible(false)}
      >
        <ConfirmDialog
          onClose={onClearAllDataConfirm}
          header='Clear All Data'
          message='Are you sure you want to delete all local storage? This action cannot be undone.'
        />
      </Dialog>
      <Dialog
        isOpen={createTestDataDialogVisible}
        onClose={() => setCreateTestDataDialogVisible(false)}
      >
        <ConfirmDialog
          onClose={onCreateTestDataConfirm}
          header='Create Test Data'
          message='Create 5 test players?'
        />
      </Dialog>
      <View className='flex-1 justify-center items-center bg-text-300 dark:bg-background-900 gap-5 p-5'>
        <Button
          primary
          size='lg'
          label="Create Test Data"
          containerClass='w-full'
          onPress={() => setCreateTestDataDialogVisible(true)}
        />
        <Button
          primary
          size='lg'
          label="Go to Storybook"
          containerClass='w-full'
          onPress={() => router.navigate('/storybook')}
        />
        <Button
          primary
          size='lg'
          label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
          containerClass='w-full'
          onPress={() => setColorScheme(currentTheme === 'dark' ? 'light' : 'dark')}
        />
        <Button
          primary
          size='lg'
          label='Clear Player Data'
          containerClass='w-full'
          onPress={() => setConfirmClearPlayerDataDialogVisible(true)}
        />
        <Button
          primary
          size='lg'
          label='Clear All Data'
          containerClass='w-full'
          onPress={() => setConfirmClearAllDataDialogVisible(true)}
        />
      </View>
    </View>
  );
}
