/**
@fileoverview Service layer for handling Supabase authentication operations.
@description This module encapsulates all direct interactions with Supabase Auth (via client from ''lib/supabaseClient')' (see below for file content), providing a clean API for the rest of the application (e.g., Zustand stores, UI components). Built for React Native 0.79, Expo 53, using TypeScript, ESM, and pnpm. This service is crucial for robust user authentication and session management.
Key features using the stack:
Interacts with supabase.auth (from ''lib/supabaseClient')' (see below for file content) for sign-up, sign-in, and sign-out.
Defines a consistent AuthServiceResponse type for auth operations.
Abstracts Supabase client calls, promoting separation of concerns and testability.
Includes methods for OAuth, password reset, and password updates.
@dependencies
@supabase/supabase-js (types and client via supabaseClient)
''lib/supabaseClient'`' (see below for file content)
@returns
signUpWithEmail: Function to sign up a user.
signInWithEmail: Function to sign in a user.
signOut: Function to sign out a user.
signInWithOAuth: Function to initiate OAuth sign-in.
resetPasswordForEmail: Function to send a password reset email.
updateUserPassword: Function to update an authenticated user's password.
AuthServiceResponse: Exported type for response structure.
@notes
This service is typically consumed by Zustand store actions (authStore) to manage global auth state.
Centralizing all Supabase auth logic here facilitates secure and diverse login options that can enhance user attraction and reduce onboarding friction.
*/

// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
import type {
  AuthError,
  Session,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  User,
  SignInWithOAuthCredentials,
  OAuthResponse,
} from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient.ts';

export interface AuthServiceResponse {
  error: AuthError | null;
  session: Session | null;
  user: User | null;
}

export const signUpWithEmail = async (
  credentials: SignUpWithPasswordCredentials,
): Promise<AuthServiceResponse> => {
  const { data, error } = await supabase.auth.signUp(credentials);
  return { error, session: data.session, user: data.user };
};

export const signInWithEmail = async (
  credentials: SignInWithPasswordCredentials,
): Promise<AuthServiceResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  return { error, session: data.session, user: data.user };
};

export const signOut = async (): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/**
 * Initiates OAuth sign-in with a specified provider.
 * The app must handle the callback URL to complete the authentication.
 * @param params Parameters for OAuth sign-in, including provider and options like redirectTo.
 * @returns A promise that resolves to the OAuth sign-in response (data or error).
 */
export const signInWithOAuth = async (
  params: SignInWithOAuthCredentials,
): Promise<OAuthResponse> => {
  // `redirectTo` is crucial and must match your Expo app's scheme and Supabase config.
  // Example: `yourappscheme://auth/callback`
  // This is typically passed in the `options` part of params.
  const response = await supabase.auth.signInWithOAuth(params);
  return response;
};

/**
 * Sends a password reset email to the user.
 * @param email The user's email address.
 * @param redirectTo The URL to redirect to after the user clicks the reset link.
 *                   This screen should handle the password update.
 *                   Example: `yourappscheme://auth/update-password`
 * @returns A promise that resolves to an object containing an error if one occurred.
 */
export const resetPasswordForEmail = async (
  email: string,
  redirectTo: string,
): Promise<{ data: {}; error: AuthError | null } | { data: { user: User | null, session: Session | null }; error: null } > => { // Type needs to align with Supabase actual response
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  return { data: data || {}, error }; // Supabase v2 resetPasswordForEmail returns { data: {}, error: AuthError | null }
                                     // or { data: { user: User, session: Session }, error: null } if email is not found.
                                     // The exact type can be complex. Simplified here.
};

/**
 * Updates the user's password. This is typically used after a password reset flow
 * or when an authenticated user wants to change their password.
 * @param newPassword The new password for the user.
 * @returns A promise that resolves to the user and session data, or an error.
 */
export const updateUserPassword = async (
  newPassword: string
): Promise<AuthServiceResponse> => {
    const { data: userData, error: userError } = await supabase.auth.updateUser({ password: newPassword });
    if (userError) {
      return { user: null, session: null, error: userError };
    }
    // After updating the user, Supabase client usually updates its session automatically.
    // Re-fetching session explicitly ensures we return the latest state if needed.
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    return { user: userData.user, session: sessionData.session, error: sessionError || userError };
};
// END WRITING FILE CODE
