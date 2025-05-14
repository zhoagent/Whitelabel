/**
 * @fileoverview Root layout for the NovaKit application.
 * @description Initializes global providers like QueryClientProvider, GestureHandlerRootView, and the new AuthStateSyncer. It's the entry point for the app's UI structure, ensuring all foundational elements are in place for React Native 0.79, Expo 53, using Supabase, Zustand, and Expo Router.
 *
 * Key features using the stack:
 * - Imports polyfills ('src/lib/polyfills') and i18n setup ('src/lib/i18n/setup') critical for Supabase and fbtee.
 * - Wraps the app with QueryClientProvider for TanStack Query.
 * - Includes GestureHandlerRootView for gesture support (e.g., for @gorhom/bottom-sheet).
 * - Introduces AuthStateSyncer to synchronize Supabase auth state with authStore (Zustand) and handle initial routing logic.
 * - Retains ViewerContext temporarily for non-auth global state like locale.
 * - Uses Expo Router's <Slot /> to render the current route.
 *
 * @dependencies
 * - 'src/lib/polyfills'
 * - 'src/lib/i18n/setup'
 * - 'global.css' (NativeWind)
 * - 'expo-router'
 * - 'react-native'
 * - 'react-native-gesture-handler'
 * - '@tanstack/react-query'
 * - 'src/lib/queryClient'
 * - 'src/user/useViewerContext' (temporarily for non-auth state)
 * - 'src/lib/supabaseClient' (for AuthStateSyncer)
 * - 'src/store/authStore' (for AuthStateSyncer)
 * - 'react'
 *
 * @notes
 * - AuthStateSyncer is crucial for a reactive and reliable authentication flow, which underpins user trust and access to personalized/premium features.
 * - The order of providers can be important; QueryClientProvider is generally high up.
 */

// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
import '../lib/polyfills.ts'; // CRITICAL: Import polyfills first for Supabase and other libraries.
import '../lib/i18n/setup.tsx'; // Setup fbtee for internationalization.
import 'global.css'; // Import NativeWind global styles.

import { Slot, useRouter, useSegments, Href } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';
import { queryClient } from '../lib/queryClient.ts';
import { ViewerContext } from '../user/useViewerContext.tsx';
import { supabase } from '../lib/supabaseClient.ts';
import { useAuthStore, AuthState } from '../store/authStore.ts'; // Assuming AuthState is exported from authStore
import colors from '../styles/theme.ts'; // Assuming theme.ts exports an object with a primary color

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(app)',
};

/**
 * AuthStateSyncer Component
 * This component is responsible for listening to Supabase authentication state changes
 * and updating the Zustand authStore accordingly. It also handles initial session loading
 * and basic redirection logic based on auth state and current route.
 * It does not render any UI itself.
 */
function AuthStateSyncer() {
  const { setUserAndSession, session, isLoading } = useAuthStore(
    (state) => ({ // Select only needed state and actions
      setUserAndSession: state.setUserAndSession,
      session: state.session,
      isLoading: state.isLoading,
    })
  );
  const router = useRouter();
  const segments = useSegments();

  // Effect for listening to Supabase auth state changes (runs once)
  useEffect(() => {
    // console.log('[AuthStateSyncer] Setting up onAuthStateChange listener.');
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, currentSession: Session | null) => {
        // console.log('[AuthStateSyncer] onAuthStateChange event:', _event, 'Session:', !!currentSession);
        setUserAndSession(currentSession?.user ?? null, currentSession);
      },
    );

    return () => {
      // console.log('[AuthStateSyncer] Unsubscribing from onAuthStateChange.');
      authListener.subscription.unsubscribe();
    };
  }, [setUserAndSession]); // Only depends on setUserAndSession

  // Effect for initial session loading (runs once)
  useEffect(() => {
    // console.log('[AuthStateSyncer] Attempting to get initial session.');
    supabase.auth.getSession().then(({ data: { session: initialSession } }: { data: { session: Session | null } }) => {
      // console.log('[AuthStateSyncer] Initial session fetched:', !!initialSession);
      // If there's an initial session, set it. Otherwise, onAuthStateChange (or lack of event)
      // will ensure the store reflects no user, and isLoading becomes false.
      // The setLoading(false) is handled by setUserAndSession.
      if (initialSession) {
        setUserAndSession(initialSession.user, initialSession);
      } else {
        // If no initial session, ensure isLoading becomes false.
        // setUserAndSession(null, null) would also do this.
        // We call it explicitly to ensure loading state is handled even if onAuthStateChange doesn't fire immediately.
        setUserAndSession(null, null);
      }
    });
  }, [setUserAndSession]); // Only depends on setUserAndSession

  // Effect for handling navigation based on auth state and route
  useEffect(() => {
    // console.log(`[AuthStateSyncer] Navigation effect. isLoading: ${isLoading}, Session: ${!!session}, Segments: ${segments.join('/')}`);
    // Wait until initial loading is done
    if (isLoading) {
      // console.log('[AuthStateSyncer] Still loading initial auth state, skipping navigation.');
      return;
    }

    const isAuthScreen = (segments[0] as string) === '(auth)' || segments[0] === 'login';

    if (session) {
      // User is logged in
      if (isAuthScreen) {
        // console.log('[AuthStateSyncer] User signed in, on auth screen, redirecting to app.');
        router.replace('/(app)/' as Href);
      } else {
        // console.log('[AuthStateSyncer] User signed in, not on auth screen, no redirect needed by this effect.');
      }
    } else {
      // User is not logged in
      const isLoginPage = segments[0] === 'login';
      // Add any other public routes/groups here if needed
      const isPublicPage = (segments[0] as string) === '(public)';

      if (segments.length > 0 && segments[0] !== undefined && !isLoginPage && !isPublicPage && !isAuthScreen) {
        // console.log('[AuthStateSyncer] User signed out, not on a public/auth screen, redirecting to login.');
        router.replace('/login' as Href);
      } else {
        // console.log('[AuthStateSyncer] User signed out, but on login/public/auth screen, no redirect needed by this effect.');
      }
    }
  }, [session, segments, router, isLoading]); // Depends on session, segments, router, and isLoading

  // This component itself doesn't render UI.
  // The RootLayout handles the global loading indicator based on useAuthStore().isLoading.
  return null;
}

export default function RootLayout() {
  const isLoadingAuth = useAuthStore((state: AuthState) => state.isLoading); // Added AuthState type
  const segments = useSegments(); // Added to use in segmentsLoadedEnoughForInitialCheck

  // Helper to determine if segments are loaded enough to make a decision
  // For initial load, segments might be empty or just ['_layout'] briefly
  // We want to show loading until we know if we are in (auth) or (app) or a real screen path
  // This is a bit of a heuristic because Expo Router's segment loading can be tricky initially.
  // A simple check for now: if segments are empty, assume we're still in initial router setup.
  // Once segments has at least one item, we can make better decisions.
  // This is mainly for the global loading indicator in RootLayout.
  // The AuthStateSyncer and (app)/_layout.tsx guard have more fine-grained segment checks.
  const segmentsLoadedEnoughForInitialCheck = () => {
      // This function is not directly available here, would need to use useSegments() hook if logic is complex.
      // For simplicity, the isLoadingAuth check in RootLayout is a broad initial loading.
      // Finer-grained loading/redirects are handled by AuthStateSyncer and the (app) layout guard.
      // The global loading indicator is shown if `isLoadingAuth` is true.
      // Once `isLoadingAuth` becomes false (after initial getSession or onAuthStateChange), Slot renders.
    return segments.length > 0; // Updated to use actual segments
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ViewerContext>
        {/* AuthStateSyncer is critical for keeping Zustand store in sync with Supabase auth */}
        <AuthStateSyncer />
        <GestureHandlerRootView style={{ flex: 1 }}>
          {isLoadingAuth && segmentsLoadedEnoughForInitialCheck() ? (
            // Display a global loading indicator while initial auth state is determined.
            // This ensures a smoother UX by preventing screen flashes.
            // NativeWind is used for styling this crucial piece of UX.
            <View className="flex-1 justify-center items-center bg-background dark:bg-neutral-900">
              <ActivityIndicator color={colors.purple} size="large" />
            </View>
          ) : (
            <View className="flex-col flex-1 p-0">
              <Slot />
            </View>
          )}
        </GestureHandlerRootView>
      </ViewerContext>
    </QueryClientProvider>
  );
}
// END WRITING FILE CODE
