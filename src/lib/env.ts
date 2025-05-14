/**
 * @fileoverview Provides type-safe access to environment variables.
 * @description This module centralizes the retrieval of environment variables, ensuring they are accessed in a type-safe manner and that critical variables are present. This is essential for configuring services like Supabase in a React Native 0.79 / Expo 53 application. It contributes to robust application startup and configuration.
 *
 * Key features using the stack:
 * - Uses `process.env` as the source, compatible with Expo's environment variable system.
 * - Throws an error if a required environment variable is not set, promoting early detection of configuration issues.
 * - Exports strongly-typed constants for easy and safe consumption elsewhere in the app.
 * - Works within an ESM ("type": "module") environment.
 *
 * @dependencies
 * - Relies on `src/types/env.d.ts` for `NodeJS.ProcessEnv` typings.
 *
 * @returns
 * - Exports constants for `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
 *
 * @notes
 * - Ensure that corresponding `EXPO_PUBLIC_` prefixed variables are defined in your `.env` file for local development or as secrets in EAS Build for production.
 */

// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)

/**
 * Retrieves an environment variable by its key.
 * Throws an error if the environment variable is not set.
 * @param key The key of the environment variable.
 * @returns The value of the environment variable.
 * @throws Error if the environment variable is not set.
 */
const getEnvVariable = (key: keyof NodeJS.ProcessEnv): string => {
  const value = process.env[key];
  if (!value && key !== 'EXPO_PUBLIC_REVENUECAT_APPLE_KEY' && key !== 'EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY') { // Allow optional keys to be undefined
    // For required keys, throw an error.
    const errorMessage = `Environment variable ${key} is not set. Please ensure it's defined in your .env file for local development or as an EAS Build secret.`;
    throw new Error(errorMessage);
  }
  return value || ''; // Return empty string for optional keys if not set, or actual value.
};

/**
 * The public URL for your Supabase project.
 * This is safe to expose in a client-side app.
 */
export const SUPABASE_URL = getEnvVariable('EXPO_PUBLIC_SUPABASE_URL');

/**
 * The public "anon" key for your Supabase project.
 * This is safe to expose in a client-side app. Row Level Security (RLS) is used to protect your data.
 */
export const SUPABASE_ANON_KEY = getEnvVariable('EXPO_PUBLIC_SUPABASE_ANON_KEY');

/**
 * (Optional) RevenueCat API Key for the Apple App Store.
 * Required if implementing iOS in-app purchases with RevenueCat.
 */
export const REVENUECAT_APPLE_KEY = process.env.EXPO_PUBLIC_REVENUECAT_APPLE_KEY;

/**
 * (Optional) RevenueCat API Key for the Google Play Store.
 * Required if implementing Android in-app purchases with RevenueCat.
 */
export const REVENUECAT_GOOGLE_KEY = process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY;

// console.log('[NovaKit] Environment variables loaded:');
// console.log(`  SUPABASE_URL: ${SUPABASE_URL ? 'SET' : 'NOT SET'}`);
// console.log(`  SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'}`);
// console.log(`  REVENUECAT_APPLE_KEY: ${REVENUECAT_APPLE_KEY ? 'SET' : 'NOT SET (Optional)'}`);
// console.log(`  REVENUECAT_GOOGLE_KEY: ${REVENUECAT_GOOGLE_KEY ? 'SET' : 'NOT SET (Optional)'}`);

// END WRITING FILE CODE
