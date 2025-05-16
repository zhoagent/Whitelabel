/**
@fileoverview Provides a legacy context for viewer-specific data, primarily locale and local settings.
@description This context hook is slated for deprecation. Its responsibilities are being migrated: authentication state to authStore (Zustand), locale management to settingsStore (Zustand), and user profile data to TanStack Query + Supabase. For now, it handles locale switching using fbtee and persists simple local settings via AsyncStorage. This setup supports React Native 0.79, Expo 53, ESM.
Key features using the stack (current, to be refactored):
Manages locale state and provides setLocale function integrating with fbtee and dynamic imports for translation files from '@/locales/*.json' (dynamic imports).
Persists localSettings using @react-native-async-storage/async-storage.
Uses @nkzw/create-context-hook for context creation.
@dependencies
@nkzw/create-context-hook;
@react-native-async-storage/async-storage;
react;
'@/lib/i18n/getLocale' (for fbtee integration);
'@/locales/*.json' (dynamic imports);
@returns
ViewerContext: The React context object.
useViewerContext: Hook to access the context value.
useLocalSettings: Convenience hook for local settings.
@notes
DEPRECATION WARNING: This context will be removed. Migrate its functionalities:
Auth state: Use useAuthStore from '@/store/authStore'.
Locale management: Will move to a new useSettingsStore (Zustand), which will also handle persistence.
User-specific settings: Best stored in Supabase profiles table and fetched via TanStack Query.
The current implementation of localSettings is generic; user-specific settings would require more complex key management if not moved to Supabase.
*/
import createContextHook from '@nkzw/create-context-hook';
import UntypedAsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState, useEffect } from 'react';
import type { TranslationTable } from 'fbtee';
import getResolvedLocaleFromLib, { // Renamed to avoid conflict with local state
  setClientLocale as setFbTeeClientLocale,
} from '@/lib/i18n/getLocale';

const AsyncStorage = UntypedAsyncStorage as unknown as Readonly<{
  getItem: (key: string) => Promise<string | null>;
  removeItem: (key: string) => Promise<void>;
  setItem: (key: string, value: string) => Promise<void>;
}>;

type LocalSettings = Readonly<{
  localSettingExample: string | null;
}>;

const LOCAL_SETTINGS_STORAGE_KEY = '$appLocalSettings';

const initialLocalSettings: LocalSettings = {
  localSettingExample: null,
} as const;

type FbtTranslationModule = {
  default: {
    fbLocale?: string;
    translations: { [hashKey: string]: TranslationTable };
  };
};

const [ViewerContext, useViewerContext] = createContextHook(() => {
  const [locale, _setLocale] = useState(getResolvedLocaleFromLib);

  const setLocale = useCallback((newLocale: string) => {
    setFbTeeClientLocale(newLocale, async (localeToLoad: string) => {
      try {
        if (localeToLoad === 'ja_JP') {
          const module: FbtTranslationModule = await import('@/locales/ja_JP.json');
          return module.default.translations;
        }
        if (localeToLoad === 'en_US') {
          const module: FbtTranslationModule = await import('@/locales/en_US.json');
          return module.default.translations || {};
        }
      } catch (error) {
        console.error(`[ViewerContext] Failed to load translations for ${localeToLoad}:`, error);
      }
      return {};
    });
    _setLocale(newLocale);
  }, []);

  const [localSettings, setLocalSettings] =
    useState<LocalSettings>(initialLocalSettings);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem(
          LOCAL_SETTINGS_STORAGE_KEY,
        );
        if (storedSettings) {
          setLocalSettings(JSON.parse(storedSettings));
        }
      } catch (error) {
        console.error('[ViewerContext] Failed to load local settings:', error);
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
      ).catch((error) => {
        console.error('[ViewerContext] Failed to save local settings:', error);
      });
    },
    [localSettings],
  );

  // Placeholder login/logout for context structure, will be removed.
  const login = () => { /* console.log('Legacy login called'); */ };
  const logout = () => { /* console.log('Legacy logout called'); */ };
  const isAuthenticated = false; // Placeholder

  return {
    isAuthenticated, // Placeholder
    localSettings,
    locale,
    login, // Placeholder
    logout, // Placeholder
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
