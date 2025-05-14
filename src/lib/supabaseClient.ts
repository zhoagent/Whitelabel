/**
 * @fileoverview Initializes and exports the Supabase client.
 * @description This module configures and provides a singleton instance of the Supabase client, enabling interaction with Supabase services like Auth, Database, Storage, and Edge Functions. It leverages environment variables for configuration and AsyncStorage for session persistence, tailored for a React Native 0.79 / Expo 53 application.
 *
 * Key features using the stack:
 * - Uses `createClient` from `@supabase/supabase-js`.
 * - Configured with environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) from './env'.
 * - Uses `@react-native-async-storage/async-storage` for session persistence, crucial for mobile UX.
 * - `autoRefreshToken` is enabled for seamless session management.
 * - `detectSessionInUrl` is set to `false`, which is important for mobile applications.
 * - Typed with `<Database>` generic from '../types/supabase' (auto-generated) for type-safe queries.
 * - Relies on `react-native-url-polyfill` (imported in './polyfills.ts' and initialized in `app/_layout.tsx`).
 *
 * @dependencies
 * - `@supabase/supabase-js`
 * - `@react-native-async-storage/async-storage`
 * - './env' (for environment variables)
 * - '../types/supabase' (for database typings)
 *
 * @returns
 * - Exports the configured `supabase` client instance.
 *
 * @notes
 * - Ensure `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are correctly set in your environment.
 * - `react-native-url-polyfill` must be imported and initialized globally before this client is used.
 * - Row Level Security (RLS) must be enabled on your Supabase tables to protect data.
 */

// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './env.js';
import type { Database } from '../types/supabase.js'; // Will use the generated types

if (!SUPABASE_URL) {
  throw new Error(
    "Supabase URL is missing. Check your .env file or EAS secrets for EXPO_PUBLIC_SUPABASE_URL."
  );
}

if (!SUPABASE_ANON_KEY) {
  throw new Error(
    "Supabase Anon Key is missing. Check your .env file or EAS secrets for EXPO_PUBLIC_SUPABASE_ANON_KEY."
  );
}

// Adapter for AsyncStorage to ensure compatibility with Supabase's expected storage interface
// and to satisfy ESLint's sorted-keys rule.
const adaptedAsyncStorage: {
  getItem: (key: string) => Promise<string | null>;
  removeItem: (key: string) => Promise<void>;
  setItem: (key: string, value: string) => Promise<void>;
} = {
  getItem: async (key: string): Promise<string | null> => {
    return await AsyncStorage.default.getItem(key);
  },
  removeItem: async (key: string): Promise<void> => {
    return await AsyncStorage.default.removeItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    return await AsyncStorage.default.setItem(key, value);
  },
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    detectSessionInUrl: false, // Important for mobile, as URL-based session detection is not standard
    persistSession: true,
    storage: adaptedAsyncStorage,
  },
});

// For development verification, you might want to log successful initialization
// console.log('[NovaKit] Supabase client initialized.');
// END WRITING FILE CODE
