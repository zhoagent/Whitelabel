/**
@fileoverview Initializes and exports the Supabase client instance.
@description This module creates a singleton Supabase client, configured with environment variables for URL and anon key, and sets up an AsyncStorage adapter for session persistence. This is the primary interface for all Supabase interactions (Auth, Database, Storage, Edge Functions). Built for React Native 0.79, Expo 53, using TypeScript, ESM, and pnpm.
Key features using the stack:
Uses createClient from @supabase/supabase-js.
Configures AsyncStorage (from @react-native-async-storage/async-storage) for session persistence, essential for mobile.
Sets autoRefreshToken and persistSession to true for seamless session management.
Sets detectSessionInUrl to false, crucial for React Native applications to correctly handle deep-link based authentication flows (OAuth, magic links).
Retrieves Supabase URL and Anon Key from environment variables via '@/lib/env'.
Uses Supabase TypeScript-generated Database type (from '@/types/supabase') for strong type safety in client interactions.
@dependencies
@react-native-async-storage/async-storage
@supabase/supabase-js
'@/types/supabase' (Generated Supabase DB types)
'@/lib/env' (For type-safe environment variables)
@returns
Exports the configured supabase client instance.
@notes
react-native-url-polyfill must be imported globally (e.g., in '@/app/_layout.tsx'). This is correctly handled in the existing src/lib/polyfills.ts and its import in src/app/_layout.tsx.
Secure handling of Supabase keys (anon key is public, service_role key must be server-side only) and robust Row Level Security (RLS) are paramount for data protection and user trust.
This client is the backbone for data-driven features that can enhance attraction, status, self-improvement, and entertainment.
*/
// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
import AsyncStorageLib = require('@react-native-async-storage/async-storage');
import { createClient, type SupabaseClientOptions } from '@supabase/supabase-js';
import type { Database } from '../types/supabase.js'; // Relative path is fine for co-located types if not using alias
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './env.js'; // Relative path for local module

if (!SUPABASE_URL) {
  throw new Error(
    "Supabase URL is missing. Check your .env file or EAS secrets for EXPO_PUBLIC_SUPABASE_URL."
  );
}
if (!SUPABASE_ANON_KEY) {
  throw new Error(
    "SUPABASE Anon Key is missing. Check your .env file or EAS secrets for EXPO_PUBLIC_SUPABASE_ANON_KEY."
  );
}

// Define a type for the storage adapter that matches Supabase's expectations
interface CustomSupabaseStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

// Create an adapter for AsyncStorage
const asyncStorageAdapter: CustomSupabaseStorage = {
  async getItem(key: string): Promise<string | null> {
    return AsyncStorageLib.default.getItem(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    return AsyncStorageLib.default.setItem(key, value);
  },
  async removeItem(key: string): Promise<void> {
    return AsyncStorageLib.default.removeItem(key);
  },
};

const supabaseOptions: SupabaseClientOptions<"public"> = {
  auth: {
    storage: asyncStorageAdapter, // Use the custom adapter
    autoRefreshToken: true,
    detectSessionInUrl: false, // Crucial for React Native OAuth
    persistSession: true,
  },
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, supabaseOptions);

// console.log('[NovaKit] Supabase client initialized.');
// END WRITING FILE CODE
