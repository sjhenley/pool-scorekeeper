import { useState, useEffect, useCallback } from 'react';
import { getPreferences, setPreferenceItem } from '@/dao/preferences.dao';
import { Preferences } from '@/models/preferences';

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>();

  useEffect(() => {
    async function fetchPreferences() {
      const prefs = await getPreferences();
      setPreferences(prefs);
    }
    fetchPreferences();
  }, []);

  const updatePreference = useCallback(async (key: keyof Preferences, value: any) => {
    await setPreferenceItem(key, value);
    setPreferences(prev => ({ ...prev, [key]: value }));
  }, []);

  console.log('Current preferences: ', preferences);

  return { preferences, setPreference: updatePreference };
}
