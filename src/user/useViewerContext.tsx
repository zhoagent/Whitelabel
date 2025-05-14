// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
import createContextHook from '@nkzw/create-context-hook';
import UntypedAsyncStorage from '@react-native-async-storage/async-storage';
// useRouter is not directly used here anymore for auth redirects
import { useCallback, useState, useEffect } from 'react';
import getLocaleFbTee, {
  setClientLocale as setFbTeeClientLocale,
} from '@/lib/i18n/getLocale'; // Using @/ alias and renamed import for clarity

// The type of AsyncStorage is not correctly exported when using `"type": "module"` 🤷‍♂️.
const AsyncStorage = UntypedAsyncStorage as unknown as Readonly<{
  getItem: (key: string) => Promise<string | null>;
  removeItem: (key: string) => Promise<void>; // Added removeItem for completeness
  setItem: (key: string, value: string) => Promise<void>;
}>;

type LocalSettings = Readonly<{
  localSettingExample: string | null;
  // Add other non-sensitive, user-specific client-side settings here
}>;

// This was the key for localSettings, it depended on user.id.
// Since user.id is now in authStore, this persistence needs to be re-evaluated if localSettings are user-specific.
// For now, let's make it a generic key or assume localSettings are not user-bound in this context.
// If they ARE user-bound, useViewerContext would need to observe authStore's user.id to change its storage key.
// For simplicity in this step, we'll assume localSettings here are app-generic or use a fixed key.
// A better approach for user-specific settings would be to store them in Supabase profiles table.
const LOCAL_SETTINGS_STORAGE_KEY = '$appLocalSettings'; // Generic key

const initialLocalSettings: LocalSettings = {
  localSettingExample: null,
} as const;

const [ViewerContext, useViewerContext] = createContextHook(() => {
  // Locale state management (temporarily here, will move to settingsStore)
  const [locale, _setLocale] = useState(getLocaleFbTee);

  const setLocale = useCallback((newLocale: string) => {
    // Logic from src/lib/i18n/setup.tsx for loading translations
    setFbTeeClientLocale(newLocale, async (localeToLoad: string) => {
      try {
        // This dynamic import structure should align with how fbtee expects to load translations
        if (localeToLoad === 'ja_JP') {
          const module = await import('@/locales/ja_JP.json');
          return module.default.translations;
        }
        if (localeToLoad === 'en_US') {
          const module = await import('@/locales/en_US.json');
          return module.default.translations;
        }
        // Add other locales here
      } catch {
        // console.error(\`[ViewerContext] Failed to load translations for \${localeToLoad}:\`, error);
      }
      return {}; // Fallback
    });
    _setLocale(newLocale);
  }, []);

  // Local settings state management
  const [localSettings, setLocalSettings] =
    useState<LocalSettings>(initialLocalSettings);

  // Effect to load localSettings from AsyncStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem(
          LOCAL_SETTINGS_STORAGE_KEY,
        );
        if (storedSettings) {
          setLocalSettings(JSON.parse(storedSettings));
        }
      } catch {
        // console.error('[ViewerContext] Failed to load local settings:', error);
      }
    };
    loadSettings();
  }, []);

  const updateLocalSettings = useCallback(
    (settings: Partial<LocalSettings>) => {
      const newSettings = {
        ...localSettings,
        ...settings,
      };
      setLocalSettings(newSettings);
      AsyncStorage.setItem(
        LOCAL_SETTINGS_STORAGE_KEY,
        JSON.stringify(newSettings),
      ).catch(error => {
        // console.error('[ViewerContext] Failed to save local settings:', error);
      });
    },
    [localSettings],
  );

  // Auth-related state (user, isAuthenticated) and functions (login, logout)
  // have been REMOVED from this context. They are now managed by:
  // - \`authStore\` (Zustand) for client-side state.
  // - \`AuthStateSyncer\` in \`_layout.tsx\` for Supabase events.
  // - \`authService.ts\` (to be created) for Supabase API calls.

  return {
    // Auth properties are removed
    // isAuthenticated: false, (Removed)
    // user: null, (Removed)
    // login: async () => {}, (Removed)
    // logout: async () => {}, (Removed)

    localSettings,
    locale,
    setLocale,
    updateLocalSettings,
  };
});

export function useLocalSettings() {
  const { localSettings, updateLocalSettings } = useViewerContext();
  return [localSettings, updateLocalSettings] as const;
}

export { ViewerContext };
export default useViewerContext;
// END WRITING FILE CODE
