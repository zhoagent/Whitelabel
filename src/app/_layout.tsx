/**
@fileoverview Root layout for the NovaKit application.
@description This component sets up global providers (QueryClientProvider, GestureHandlerRootView), loads essential polyfills and i18n configurations, handles font loading, and implements the core authentication state synchronization logic with Supabase. It acts as the entry point for routing managed by Expo Router. Built for React Native 0.79, Expo 53, ESM, and pnpm, leveraging the React Compiler. This foundational setup is critical for a stable, performant, and globally accessible application.
Key features using the stack:
Initializes polyfills from '@/lib/polyfills' for Supabase compatibility (e.g., react-native-url-polyfill).
Sets up internationalization from '@/lib/i18n/setup' using fbtee for global app localization.
Imports global CSS ('../../global.css' - points to project_root/global.css) for NativeWind base styles.
Provides QueryClientProvider for TanStack Query from '@/lib/queryClient', enabling efficient server state management with Supabase.
Wraps the app in GestureHandlerRootView for advanced gesture support (e.g., for @gorhom/bottom-sheet).
Includes AuthStateSyncer component to listen to Supabase auth changes and update the authStore (Zustand) from '@/store/authStore', managing redirects via Expo Router.
Handles initial font loading with expo-font using the @assets alias for font files.
Manages a global loading state for initial auth check and font loading.
@dependencies
'@/lib/polyfills'
'@/lib/i18n/setup'
'../../global.css' (Points to project_root/global.css)
'@supabase/supabase-js'
'@tanstack/react-query'
'expo-font'
'expo-router'
'react-native', 'react-native-gesture-handler'
'@/lib/queryClient'
'@/lib/supabaseClient'
'@/store/authStore' (Zustand)
'@/styles/theme'
'@/user/useViewerContext' (legacy, for gradual refactor)
'@assets/fonts/Inter-Bold.ttf' (Font asset using @assets alias)
'@assets/fonts/Inter-Regular.ttf' (Font asset using @assets alias)
@notes
The unstable_settings.initialRouteName configures the default starting point for Expo Router.
AuthStateSyncer is critical for a seamless authentication experience, reacting to Supabase events and guiding users appropriately (engagement, retention). This is a key piece for apps managing user accounts and premium features.
The ViewerContext will be refactored; its responsibilities (like locale management) are moving to Zustand stores (settingsStore).
Path aliases (e.g., '@', '@assets') are used for cleaner, more maintainable imports.
*/
import '../lib/polyfills.ts';
import '../lib/i18n/setup.tsx';
import '../../global.css'; // This path is relative to src/app, so it correctly points to the root global.css

import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { QueryClientProvider } from '@tanstack/react-query';
import { Href, Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, AppState, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { queryClient } from '../lib/queryClient.ts';
import { supabase } from '../lib/supabaseClient.ts';
import { useAuthStore, type AuthState } from '../store/authStore.ts';
import { appColors } from '../styles/theme.ts';
import { ViewerContext } from '../user/useViewerContext.tsx'; // Legacy, will be phased out

export const unstable_settings = {
  initialRouteName: '(app)',
};

// Component to synchronize Supabase auth state with Zustand store and handle redirects
function AuthStateSyncer() {
  const setUserAndSession = useAuthStore((state: AuthState) => state.setUserAndSession);
  const clearAuth = useAuthStore((state: AuthState) => state.clearAuth);
  const setLoading = useAuthStore((state: AuthState) => state.setLoading);
  const sessionFromStore = useAuthStore((state: AuthState) => state.session);
  const isLoadingStore = useAuthStore((state: AuthState) => state.isLoading);

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    setLoading(true); // Indicate loading at the start of auth state evaluation
    // Attempt to get the initial session from Supabase.
    // This is crucial for determining if the user is already logged in when the app starts.
    supabase.auth.getSession().then(({ data: { session: supabaseSession } }: { data: { session: Session | null } }) => {
      // Update Zustand store with the initial session.
      // This ensures the app's auth state is immediately consistent with Supabase.
      setUserAndSession(supabaseSession?.user ?? null, supabaseSession);
    }).catch((error: Error) => {
      console.error("[AuthStateSyncer] Error getting initial Supabase session:", error);
      // If there's an error fetching the session (e.g., network issue), clear auth state as a precaution.
      clearAuth();
    });
    // setLoading(false) is implicitly handled by setUserAndSession or clearAuth actions in the store

    // Subscribe to Supabase authentication state changes (e.g., SIGNED_IN, SIGNED_OUT).
    // This listener is the primary mechanism for keeping the app's auth state (Zustand)
    // dynamically in sync with Supabase's auth state throughout the user's session.
    // This is key for responsive UI updates and secure route protection.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, currentSession: Session | null) => {
        setUserAndSession(currentSession?.user ?? null, currentSession);
      },
    );

    // Handle app state changes (e.g., app coming to foreground) to manage Supabase token refresh.
    // Supabase JS client can auto-refresh tokens, but this ensures it's actively managed
    // when the app becomes active, contributing to a persistent and secure session.
    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        supabase.auth.startAutoRefresh().catch((error: Error) => console.error("[AuthStateSyncer] Error starting Supabase auto refresh:", error));
      } else {
        supabase.auth.stopAutoRefresh().catch((error: Error) => console.error("[AuthStateSyncer] Error stopping Supabase auto refresh:", error));
      }
    });

    // Cleanup function: Unsubscribe from listeners when the component unmounts.
    // This prevents memory leaks and ensures proper resource management.
    return () => {
      authListener.subscription.unsubscribe();
      appStateSubscription.remove();
      supabase.auth.stopAutoRefresh().catch((error: Error) => console.error("[AuthStateSyncer] Error stopping Supabase auto refresh on unmount:", error));
    };
  }, [setUserAndSession, clearAuth, setLoading]); // Dependencies for the initial setup effect

  useEffect(() => {
    // This effect handles routing logic based on the auth state from the Zustand store.
    // It runs whenever the session, loading state, or navigation segments change.
    // This is critical for redirecting users to appropriate screens (e.g., login or main app).
    if (isLoadingStore) {
      // Prevent redirects while initial auth state or font loading is in progress.
      // This avoids UI flashes or incorrect navigation during startup.
      return;
    }
    const inAuthGroup = segments[0] === '(auth)';

    if (sessionFromStore) { // User is authenticated
      if (inAuthGroup) {
        // If authenticated and currently in an auth screen (e.g., login/signup),
        // redirect to the main app content. This improves UX by avoiding redundant auth screens.
        router.replace('/(app)/' as Href);
      }
    } else { // User is NOT authenticated
      // If not authenticated and trying to access a protected route (i.e., not in the (auth) group),
      // redirect to the login screen. This enforces route protection.
      // The `segments.length > 0 && segments[0] !== undefined` check ensures this runs
      // after the Expo Router has properly initialized its segments.
      if (segments.length > 0 && segments[0] !== undefined && !inAuthGroup) {
        router.replace('/(auth)/login' as Href);
      }
    }
  }, [sessionFromStore, segments, router, isLoadingStore]); // Dependencies for the redirect logic effect

  return null; // This component does not render any UI itself; its purpose is state synchronization and side effects.
}

export default function RootLayout() {
  const isLoadingAuth = useAuthStore((state: AuthState) => state.isLoading);

  // Global loading state: true if auth state is resolving.
  const initialLoading = isLoadingAuth;

  return (
    <QueryClientProvider client={queryClient}>
      {/* ViewerContext is legacy and will be phased out. Its current responsibilities (locale)
are being migrated to Zustand stores (e.g., settingsStore). */}
      <ViewerContext>
        <AuthStateSyncer />
        <GestureHandlerRootView style={{ flex: 1 }}>
          {initialLoading ? (
            // Display a global loading indicator during initial auth check and font loading.
            // This ensures a smooth UX by preventing content flashes. NativeWind styled.
            <View className="flex-1 justify-center items-center bg-background dark:bg-neutral-900">
              <ActivityIndicator color={appColors.primary} size="large" />
            </View>
          ) : (
            // Once initial loading is complete, render the main application content via Expo Router's <Slot>.
            // The background color ensures a consistent theme application from the root.
            <View className="flex-1 bg-background dark:bg-neutral-900">
              <Slot />
            </View>
          )}
        </GestureHandlerRootView>
      </ViewerContext>
    </QueryClientProvider>
  );
}
// END WRITING FILE CODE
