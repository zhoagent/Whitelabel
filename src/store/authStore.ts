/**
 * @fileoverview Zustand store for managing authentication state.
 * @description This store centralizes the user's session, user profile data (from Supabase), and authentication loading status. It's a critical piece for controlling access to features, personalizing the user experience, and underpinning monetization strategies within the React Native 0.79 / Expo 53 application.
 *
 * Key features using the stack:
 * - Manages `user: User | null`, `session: Session | null`, `isLoading: boolean` states.
 * - Provides actions `setUserAndSession`, `clearAuth`, `setLoading` for state manipulation.
 * - Uses types (`User`, `Session`) from `@supabase/supabase-js` for integration with Supabase Auth.
 * - Designed for a lean, boilerplate-free global state solution with Zustand.
 * - Initial `isLoading` state is `true` to handle asynchronous session restoration by Supabase client.
 *
 * @dependencies
 * - `zustand`
 * - `@supabase/supabase-js` (for `Session`, `User` types)
 *
 * @returns
 * - `useAuthStore`: A Zustand hook to access and manipulate authentication state.
 *
 * @monetizationHooks
 * - The `user` and `session` state are fundamental for checking premium status (which will be added to the user profile or managed through custom claims in Supabase, synced via RevenueCat webhooks). Conditional rendering of premium features will rely heavily on this store.
 *
 * @notes
 * - This store will be updated by listeners to Supabase's `onAuthStateChange` event.
 * - The `isLoading` flag is crucial for rendering appropriate UI (e.g., loading spinners styled with NativeWind) while the app determines the initial authentication state.
 */

// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';

/**
 * Defines the shape of the authentication state managed by Zustand.
 */
export interface AuthState {
  /**
   * Clears the user and session, typically after a logout.
   * Also sets isLoading to false.
   */
  clearAuth: () => void;
  /** True if an authentication operation or initial session check is in progress. */
  isLoading: boolean;
  /** Holds the premium status of the user. Defaults to false. */
  isPremium: boolean; // Added per Step 4.4 requirement
  /** The Supabase Session object if a user is authenticated, otherwise null. */
  session: Session | null;
  /**
   * Explicitly sets the loading state for authentication processes.
   * @param loading The new loading state.
   */
  setLoading: (loading: boolean) => void;
  /**
   * Placeholder for a function that will update premium status,
   * to be populated later when monetization is fully integrated.
   * This premium status will be derived from Supabase (profiles table or custom claims)
   * which in turn is updated by RevenueCat webhooks.
   * @param isPremium - Boolean indicating if the user has an active premium subscription.
   */
  setPremiumStatus: (isPremium: boolean) => void; // Added per Step 4.4 requirement
  /**
   * Sets the user and session, typically after a successful login or session restoration.
   * Also sets isLoading to false.
   * @param user The Supabase User object or null.
   * @param session The Supabase Session object or null.
   */
  setUserAndSession: (user: User | null, session: Session | null) => void;
  /** The Supabase User object if a user is authenticated, otherwise null. */
  user: User | null;
}

/**
 * Zustand store for managing global authentication state.
 * - `user`: Stores the authenticated Supabase user object. Crucial for personalization and status.
 * - `session`: Stores the Supabase session object. Key for API requests and session management.
 * - `isLoading`: Tracks auth-related loading states, vital for a smooth UX. Prevents UI jank during Supabase session checks.
 * - `isPremium`: Tracks user's premium status for feature gating (monetization).
 *
 * The store is initialized with `isLoading: true` to gracefully handle the initial, asynchronous
 * session check performed by the Supabase client upon app startup.
 */
export const useAuthStore = create<AuthState>((set) => ({
  clearAuth: () => {
    console.log('[DEBUG authStore] clearAuth called');
    set({ isLoading: false, isPremium: false, session: null, user: null }); // Reset premium status on logout
  },
  isLoading: true, // Start with loading true until first auth check with Supabase.
  isPremium: false, // Default premium status to false.
  session: null,
  setLoading: (loading) => {
    console.log(`[DEBUG authStore] setLoading called with: ${loading}`);
    set({ isLoading: loading });
  },
  setPremiumStatus: (isPremiumStatus) => {
    console.log(`[DEBUG authStore] setPremiumStatus called with: ${isPremiumStatus}`);
    set({ isPremium: isPremiumStatus });
  },
  setUserAndSession: (user, session) => {
    console.log('[DEBUG authStore] setUserAndSession called. User:', user ? user.id : null, 'Session:', session ? 'Exists' : null);
    set({ isLoading: false, session, user });
  },
  user: null,
}));

// For development verification:
// console.log('[NovaKit] Zustand authStore initialized and ready.');
// END WRITING FILE CODE
