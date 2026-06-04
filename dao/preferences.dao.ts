// FYI: In android, total async storage limit is 6MB
import { Preferences } from '@/models/preferences';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_PREFERENCES } from '@/const/default-preferences';

const STORAGE_KEY = 'preferences';

/**
 * Fetches all preferences from AsyncStorage.
 * Returns the Preferences object, or default preferences if none are found.
 */
export async function getPreferences(): Promise<Preferences> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : DEFAULT_PREFERENCES;
  } catch (e) {
    console.error('Error fetching preferences:', e);
    return DEFAULT_PREFERENCES;
  }
}

export async function setPreferences(preferences: Preferences): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (e) {
    console.error('Error setting preferences:', e);
  }
}

export async function setPreferenceItem(key: keyof Preferences, value: any): Promise<void> {
  try {
    const currentPreferences = await getPreferences();
    const updatedPreferences = { ...currentPreferences, [key]: value };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPreferences));
  } catch (e) {
    console.error('Error setting preference item:', e);
  }
}

/**
 * Clears all preferences data from AsyncStorage.
 */
export async function clearAllPreferences(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing preferences:', e);
  }
}
