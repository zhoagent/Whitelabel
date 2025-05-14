/**
 * @fileoverview Layout for the authenticated (main app) section, implementing an authentication guard.
 * @description This Expo Router layout uses `useAuthStore` (Zustand) to protect routes within the `(app)` group. It redirects unauthenticated users to the login screen and displays a loading indicator during the initial auth check. This ensures a secure and smooth user experience for accessing core app features.
 *
 * Key features using the stack:
 * - Uses Expo Router's `<Stack>` navigator and `<Redirect>` component for route protection.
 * - Subscribes to `useAuthStore` (Zustand) for `session` and `isLoading` state, which is driven by Supabase Auth.
 * - Renders a NativeWind-styled `ActivityIndicator` as a loading state.
 * - Includes `BottomSheetModalProvider` from `@gorhom/bottom-sheet` for modal UIs within the app.
 *
 * @dependencies
 * - `@gorhom/bottom-sheet`
 * - `expo-router`
 * - `react-native` (for `View`, `ActivityIndicator`)
 * - '../../store/authStore.js' // (Zustand)
 * - '../../styles/theme.js' // (for loading indicator color)
 *
 * @notes
 * - The loading state is crucial for preventing flashes of content or incorrect redirects while Supabase initializes the session.
 * - This guard is fundamental for any app dealing with user-specific data or premium features.
 */

// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
console.log('[AppGroupLayout] Attempting to load modules...'); // Added for debugging
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Redirect, Stack } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import colors from '@/styles/theme';

export default function AppGroupLayout() {
  const { isLoading, session } = useAuthStore();

  if (isLoading) {
    // Show a loading indicator while Supabase client initializes and checks session.
    // This is styled with NativeWind for consistency.
    // This loading indicator specifically gates the (app) group.
    // console.log('[AppGroupLayout] Auth loading, showing spinner...');
    return (
      <View className="flex-1 justify-center items-center bg-background dark:bg-neutral-900">
        <ActivityIndicator color={colors.purple} size="large" />
      </View>
    );
  }

  if (!session) {
    // If not loading and no session, redirect to the login screen.
    // This is the primary auth guard for the (app) group.
    // console.log('[AppGroupLayout] No session, redirecting to login.');
    return <Redirect href="/(auth)/login" />; // Adjusted path to an (auth) group
  }

  // console.log('[AppGroupLayout] Session active, rendering app content.');
  // If session exists, render the content of the (app) group.
  return (
    // The key={locale} was removed as locale handling will shift to settingsStore.
    // If components within (app) depend on locale from ViewerContext and don't re-render,
    // this might need adjustment when locale migration happens.
    <BottomSheetModalProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="(tabs)"
          options={{
            contentStyle: {
              backgroundColor: 'transparent', // This might be an app-specific style
            },
            // headerShown: false is already on the parent Stack
          }}
        />
        {/* Add other app-specific stack screens or modals here as needed */}
        {/* Example: <Stack.Screen name="profile/edit" options={{ presentation: 'modal' }} /> */}
      </Stack>
    </BottomSheetModalProvider>
  );
}
// END WRITING FILE CODE
