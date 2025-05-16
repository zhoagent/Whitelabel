/**
@fileoverview Login screen for user authentication.
@description This screen provides email/password login functionality. It uses Supabase for authentication via authService, Zustand (authStore) for managing loading and user state, and NativeWind for UI styling. Built for React Native 0.79, Expo 53, using TypeScript, ESM, and pnpm. A seamless login experience is vital for user retention and accessing personalized or premium content.
Key features using the stack:
Implements email/password login using signInWithEmail from '@/services/authService.ts' (Supabase interaction).
Manages loading state via useAuthStore (Zustand from '@/store/authStore.ts')'.
Uses custom core UI components (Input, Button, Text from '@/components/core')' styled with NativeWind for an attractive and consistent UI.
Provides user feedback through Alert for errors or input requirements.
Redirects to the main app or signup screen using Expo Router.
Internationalized using fbt for global accessibility.
@dependencies
expo-router
fbtee
React, { useState, useEffect }
react-native (ActivityIndicator, Alert, View)
'@/components/core/Button.tsx'
'@/components/core/Input.tsx'
'@/components/core/Text.tsx'
'@/services/authService.ts' (Supabase interactions)
'@/store/authStore.ts' (Zustand)
'@/styles/theme.ts' (for appColors)
@notes
Successful login relies on the onAuthStateChange listener (in _layout.tsx or AuthStateSyncer) to update the global session (from Supabase) and trigger navigation.
Clear error messages and loading states (driven by authStore and styled with NativeWind) are crucial for a good user experience and building trust.
*/
// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
import { Href, useRouter } from 'expo-router';
import { fbt } from 'fbtee';
import { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { Button } from '@/components/core/Button.tsx'; // Corrected path
import { Input } from '@/components/core/Input.tsx'; // Corrected path
import { Text } from '@/components/core/Text.tsx'; // Corrected path
import { signInWithEmail } from '@/services/authService.ts'; // Corrected path
import { useAuthStore } from '@/store/authStore.ts'; // Corrected path
import { appColors } from '@/styles/theme.ts'; // Corrected path

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { isLoading, session, setLoading, user } = useAuthStore();

  // Redirect if already logged in (session exists or user object exists)
  // This complements the (auth)/_layout.tsx redirect for robustness.
  useEffect(() => {
    if (session || user) {
      router.replace('/(app)/' as Href);
    }
  }, [session, user, router]);

  // If already logged in during initial render (before effect), return null to avoid rendering form.
  if (session || user) {
    return null;
  }

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        String(fbt('Input Required', 'Input required alert title')),
        String(
          fbt(
            'Please enter both email and password.',
            'Input required alert message for login',
          ),
        ),
      );
      return;
    }
    setLoading(true);
    try {
      const { error: signInError } = await signInWithEmail({ email, password });
      if (signInError) {
        Alert.alert(
          String(fbt('Login Error', 'Login error title')),
          signInError.message,
        );
        setLoading(false); // Explicitly set loading false on direct error
      }
      // On successful login, onAuthStateChange listener in _layout.tsx (AuthStateSyncer) handles
      // setting user/session and subsequent navigation. setLoading(false) is also typically
      // handled there when the session state stabilizes.
    } catch (error: unknown) {
      setLoading(false);
      Alert.alert(
        String(fbt('Login Error', 'Login error title')),
        error instanceof Error
          ? error.message
          : String(fbt('An unexpected error occurred.', 'Generic error message')),
      );
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-background dark:bg-neutral-900">
      <Text className="text-center mb-8" variant="heading1">
        <fbt desc="Login screen title">Log In</fbt>
      </Text>
      <Input
        autoCapitalize="none"
        autoComplete="email"
        inputClassName="text-base"
        keyboardType="email-address"
        label={String(fbt('Email Address', 'Email input label'))}
        onChangeText={setEmail}
        placeholder={String(fbt('you@example.com', 'Email placeholder'))}
        value={email}
      />
      <Input
        autoComplete="current-password"
        inputClassName="text-base"
        label={String(fbt('Password', 'Password input label'))}
        onChangeText={setPassword}
        placeholder={String(fbt('Enter your password', 'Password placeholder'))}
        secureTextEntry
        value={password}
      />
      <Button
        className="mt-4 py-3.5"
        disabled={isLoading}
        onPress={handleLogin}
        textClassName="text-lg"
        title={
          isLoading
            ? String(fbt('Logging In...', 'Logging in loading button text'))
            : String(fbt('Log In', 'Log in button text'))
        }
        variant="primary"
      />
      {isLoading && ( // Still show activity indicator if button doesn't have one built-in or if it's subtle
        <ActivityIndicator
          className="mt-4"
          color={appColors.primary}
          size="small"
        />
      )}
      <View className="flex-row justify-center mt-6 items-center">
        <Text className="text-neutral-600 dark:text-neutral-400" variant="body">
          <fbt desc="Sign up redirect text">Need an account?</fbt>{' '}
        </Text>
        <Button
          className="ml-1"
          onPress={() => router.push('/(auth)/signup' as Href)}
          textClassName="text-primary font-semibold"
          title={String(fbt('Sign Up', 'Sign up redirect link text'))}
          variant="ghost"
        />
      </View>
    </View>
  );
}
// END WRITING FILE CODE
