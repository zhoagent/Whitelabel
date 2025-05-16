/**
@fileoverview Layout for the authentication screens (login, signup).
@description This Expo Router layout wraps screens in the (auth) group. It includes logic to redirect authenticated users away from auth screens to the main app content, improving user flow. Built for React Native 0.79, Expo 53, using TypeScript, ESM, and pnpm.
Key features using the stack:
Uses Expo Router <Stack> for navigation within the auth flow.
Implements a redirect for already authenticated users using useAuthStore (Zustand from '@/store/authStore.ts'), which is synced with Supabase) and Expo Router's useRouter and useSegments.
@dependencies
expo-router
React, { useEffect }
'@/store/authStore.ts' (Zustand)
@notes
Redirecting authenticated users from auth screens improves UX by avoiding redundant steps and getting them to valuable content faster.
The isLoading check in the effect ensures redirection logic only runs after the initial auth state (from Supabase via authStore) has been determined, preventing premature navigation.
This contributes to a smoother onboarding/authentication experience, critical for user retention.
*/
// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
import { Stack, useRouter, useSegments, Href } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore.ts';

export default function AuthLayout() {
  const { isLoading, session } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Only run redirect logic if auth state is no longer loading
    if (!isLoading && session && segments[0] === '(auth)') {
      router.replace('/(app)/' as Href);
    }
  }, [session, segments, router, isLoading]); // Effect dependencies

  // No loading indicator here, as individual auth screens (login, signup) will manage their own UI.
  // The primary loading state is handled by the root _layout.tsx or (app)/_layout.tsx.
  return <Stack screenOptions={{ headerShown: false }} />;
}
// END WRITING FILE CODE
