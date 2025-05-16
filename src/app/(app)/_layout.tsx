/**
@fileoverview Layout for the authenticated section of the app, acting as an auth guard.
@description This Expo Router layout wraps all screens within the (app) group. It checks the authentication state from authStore (Zustand). If the user is not authenticated, it redirects to the login screen. It also provides BottomSheetModalProvider for screens in this group. Built for React Native 0.79, Expo 53, using TypeScript, ESM, and pnpm. This guard is pivotal for creating secure user experiences and managing access to potentially monetized content.
Key features using the stack:
Acts as an authentication guard using useAuthStore (Zustand from '@/store/authStore') to check session and isLoading state.
Redirects unauthenticated users to /(auth)/login using Expo Router's <Redirect>.
Displays a loading indicator (NativeWind styled ActivityIndicator from 'react-native') while auth state is resolving.
Provides BottomSheetModalProvider from @gorhom/bottom-sheet to nested screens, enabling engaging UI patterns.
Uses Expo Router <Stack> for navigation within the authenticated app shell.
@dependencies
@gorhom/bottom-sheet
expo-router
react-native (View, ActivityIndicator)
'@/store/authStore' (Zustand)
'@/styles/theme' (for appColors)
@notes
This auth guard is fundamental for securing application content and managing user flows towards engaged states or premium features.
The isLoading check prevents flashes of content or premature redirects, ensuring a smoother user experience (attraction).
The clear separation of auth state logic (Zustand, synced with Supabase) and routing logic (Expo Router) promotes maintainability and scalability for complex applications.
*/
// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Redirect, Stack } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/authStore'; // Corrected path and added semicolon
import { appColors } from '@/styles/theme'; // Corrected path and added semicolon

export default function AppGroupLayout() {
  const { isLoading, session } = useAuthStore();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background dark:bg-neutral-900">
        <ActivityIndicator color={appColors.primary} size="large" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <BottomSheetModalProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="(tabs)"
          options={
            {
              // contentStyle: { // Or sceneContainerStyle depending on exact Expo Router version behavior
              //   backgroundColor: 'transparent', // Example, individual screens should set their bg via NativeWind
              // },
            }
          }
        />
        {/* Example: <Stack.Screen name="profile/edit" options={{ presentation: 'modal' }} /> */}
      </Stack>
    </BottomSheetModalProvider>
  );
}
// END WRITING FILE CODE
