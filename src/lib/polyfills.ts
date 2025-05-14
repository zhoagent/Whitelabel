/**
 * @fileoverview Imports essential polyfills for the application.
 * @description This file ensures that necessary polyfills, like `react-native-url-polyfill`, are loaded at the very beginning of the application's lifecycle. This is crucial for libraries like Supabase JS that rely on certain browser-like global APIs. This setup is for React Native 0.79, Expo 53, in an ESM environment.
 *
 * Key features using the stack:
 * - Imports `react-native-url-polyfill` for robust URL parsing across platforms.
 *
 * @dependencies
 * - `react-native-url-polyfill`
 *
 * @notes
 * - This file should be imported as early as possible in the root layout (`'app/_layout.tsx`)'.
 * - Ensuring core polyfills are loaded prevents hard-to-debug runtime errors that can impact user experience and trust.
 */

// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
import 'react-native-url-polyfill/auto';

// console.log('[NovaKit] react-native-url-polyfill applied.'); // For dev verification

// Add any other global polyfills here if needed in the future.
// For example, if a library requires a specific Promise implementation or Intl features not universally available.
// END WRITING FILE CODE
