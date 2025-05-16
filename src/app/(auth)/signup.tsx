/**
@fileoverview Sign-up screen for new user registration.
@description This screen allows new users to create an account using email/password. It interacts with Supabase via authService, manages state with Zustand (authStore), and uses NativeWind for UI. Built for React Native 0.79, Expo 53, using TypeScript, ESM, and pnpm. A positive signup experience is crucial for user acquisition and building initial trust.
Key features using the stack:
Implements email/password sign-up using signUpWithEmail from '@/services/authService' (Supabase interaction).
Manages loading state via useAuthStore (Zustand from '@/store/authStore').
Uses custom core UI components (Input, Button, Text from '@/components/core') styled with NativeWind for a visually appealing and consistent interface.
Provides feedback on sign-up success and email verification status using Alert.
Redirects authenticated users or navigates to login using Expo Router.
Internationalized using fbt for wider reach.
@dependencies
expo-router
fbtee
React, { useState, useEffect }
react-native (ActivityIndicator, Alert, View)
'@/components/core/Button'
'@/components/core/Input'
'@/components/core/Text'
'@/services/authService' (Supabase interactions)
'@/store/authStore' (Zustand)
'@/styles/theme' (for appColors)
@notes
The user experience around email verification (if enabled in Supabase) is handled by checking user.email_confirmed_at and session status post-signup.
A seamless and reassuring signup flow, supported by clear NativeWind styling and reliable Supabase backend, is critical for converting potential users and setting them on a path to engagement and potential monetization.
*/
// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
import { Href, useRouter } from 'expo-router';
import { fbt } from 'fbtee';
import { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { Button } from '@/components/core/Button.tsx';
import { Input } from '@/components/core/Input.tsx';
import { Text } from '@/components/core/Text.tsx';
import { signUpWithEmail } from '@/services/authService.ts';
import { useAuthStore } from '@/store/authStore.ts';
import { appColors } from '@/styles/theme.ts';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { isLoading, session, setLoading, user: authenticatedUser } = useAuthStore();

  // Redirect if already logged in (session exists or user object exists)
  useEffect(() => {
    if (session || authenticatedUser) {
      router.replace('/(app)/' as Href);
    }
  }, [session, authenticatedUser, router]);

  // If already logged in during initial render (before effect), return null.
  if (session || authenticatedUser) {
    return null;
  }

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert(
        String(fbt('Input Required', 'Input required alert title')),
        String(
          fbt(
            'Please enter both email and password.',
            'Input required alert message for signup',
          ),
        ),
      );
      return;
    }
    setLoading(true);
    try {
      const { error: signUpError, session: signUpSession, user } = await signUpWithEmail({ email, password });
      if (signUpError) {
        Alert.alert(
          String(fbt('Sign Up Error', 'Sign up error title')),
          signUpError.message,
        );
      } else if (user) {
        // Supabase sometimes returns a user object but no session if email confirmation is pending.
        // A session usually means the user is effectively logged in (e.g., auto-confirmation off, or confirmed).
        const needsVerification = !signUpSession && user.email_confirmed_at === null;

        const message = needsVerification
          ? String(
              fbt(
                'Please check your email to verify your account and complete sign up.',
                'Sign up success message with email verification needed',
              ),
            )
          : String(
              fbt(
                'Account created successfully! You can now log in.',
                'Sign up success message without immediate email verification needed (e.g., auto-confirmed or session present)',
              ),
            );

        Alert.alert(
          String(fbt('Sign Up Status', 'Sign up status title')),
          message,
          [
            {
              onPress: () => router.push('/(auth)/login' as Href), // Guide to login after message
              text: String(fbt('OK', 'OK button text')),
            },
          ],
        );
      } else {
        // Fallback if user object is unexpectedly null but no error (should be rare)
        Alert.alert(
          String(fbt('Sign Up Pending', 'Sign up pending confirmation title')),
          String(
            fbt(
              'Please check your email to complete the sign up process.',
              'Generic sign up pending message',
            ),
          ),
          [
            {
              onPress: () => router.push('/(auth)/login' as Href),
              text: String(fbt('OK', 'OK button text')),
            },
          ],
        );
      }
    } catch (error: unknown) {
      Alert.alert(
        String(fbt('Sign Up Error', 'Generic sign up error title')),
        error instanceof Error
          ? error.message
          : String(fbt('An unexpected error occurred during sign up.', 'Generic error message for signup')),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-background dark:bg-neutral-900">
      <Text className="text-center mb-8" variant="heading1">
        <fbt desc="Sign up screen title">Create Account</fbt>
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
        autoComplete="new-password"
        inputClassName="text-base"
        label={String(fbt('Password', 'Password input label'))}
        onChangeText={setPassword}
        placeholder={String(
          fbt('Enter your password (min. 6 characters)', 'Password placeholder with hint'),
        )}
        secureTextEntry
        value={password}
      />
      <Button
        className="mt-4 py-3.5"
        disabled={isLoading}
        onPress={handleSignUp}
        textClassName="text-lg"
        title={
          isLoading
            ? String(fbt('Creating Account...', 'Signing up loading button text'))
            : String(fbt('Sign Up', 'Sign up button text'))
        }
        variant="primary"
      />
      {isLoading && (
        <ActivityIndicator
          className="mt-4"
          color={appColors.primary}
          size="small"
        />
      )}
      <View className="flex-row justify-center mt-6 items-center">
        <Text className="text-neutral-600 dark:text-neutral-400" variant="body">
          <fbt desc="Login redirect text">Already have an account?</fbt>{' '}
        </Text>
        <Button
          className="ml-1"
          onPress={() => router.push('/(auth)/login' as Href)}
          textClassName="text-primary font-semibold"
          title={String(fbt('Log In', 'Login redirect link text'))}
          variant="ghost"
        />
      </View>
    </View>
  );
}
// END WRITING FILE CODE
