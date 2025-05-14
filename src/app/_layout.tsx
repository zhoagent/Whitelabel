/**
 * @fileoverview Root layout for the NovaKit application.
 * @description This component sets up global providers, imports essential polyfills, and defines the initial route settings for Expo Router. It's the entry point for the app's UI structure, ensuring foundational elements like internationalization, gesture handling, and context providers are available application-wide. Built for React Native 0.79, Expo 53, ESM, with React Compiler considerations.
 *
 * Key features using the stack:
 * - Imports `'@/lib/polyfills'` (including `react-native-url-polyfill`) for Supabase compatibility.
 * - Imports `global.css` for NativeWind base styles.
 * - Initializes `fbtee` for internationalization via `'@/lib/i18n/setup'`.
 * - Wraps the application with `ViewerContext` (to be evolved into Zustand stores) and `GestureHandlerRootView`.
 * - Uses Expo Router's `<Slot />` to render the current route.
 * - Defines `unstable_settings` for initial route configuration.
 *
 * @dependencies
 * - `expo-router`
 * - `react-native`
 * - `react-native-gesture-handler`
 * - `'@/lib/i18n/setup'` (fbtee i18n)
 * - `'@/lib/polyfills'` (URL polyfill for Supabase)
 * - `global.css` (NativeWind global styles)
 * - `'@/user/useViewerContext'` (Global context provider)
 *
 * @notes
 * - The order of imports, especially for polyfills and global styles, is important.
 * - `ViewerContext` will be gradually replaced by Zustand stores for more granular and performant state management.
 */

// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
import '@/lib/polyfills'; // CRITICAL: Import polyfills first for Supabase and other libraries.
import '@/lib/i18n/setup'; // Setup fbtee for internationalization.
import 'global.css'; // Import NativeWind global styles.

import { Slot } from 'expo-router';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ViewerContext } from '@/user/useViewerContext'; // Using @/ alias

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(app)',
};

export default function RootLayout() {
  return (
    <ViewerContext>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* 
          NativeWind styling: `flex-column` is not a standard Tailwind class. 
          Assuming `flex-col` was intended for column direction.
          `p-0` is valid. The `flex-1` on GestureHandlerRootView and this View ensures full screen coverage.
        */}
        <View className="flex-col flex-1 p-0">
          <Slot />
        </View>
      </GestureHandlerRootView>
    </ViewerContext>
  );
}
// END WRITING FILE CODE
