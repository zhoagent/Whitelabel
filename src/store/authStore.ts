import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

export interface AuthState {
  clearAuth: () => void;
  isLoading: boolean;
  isPremium: boolean;
  session: Session | null;
  setLoading: (loading: boolean) => void;
  setPremiumStatus: (isPremium: boolean) => void;
  setUserAndSession: (user: User | null, session: Session | null) => void;
  user: User | null;
}

export const useAuthStore = create<AuthState>((set) => ({
  clearAuth: () => {
    // console.log('[DEBUG authStore] clearAuth called: Resetting auth state.');
    set({ isLoading: false, isPremium: false, session: null, user: null });
  },
  isLoading: true,
  isPremium: false,
  session: null,
  setLoading: (loading) => {
    // console.log(`[DEBUG authStore] setLoading called with: ${loading}`);
    set({ isLoading: loading });
  },
  setPremiumStatus: (isPremiumStatus) => {
    // console.log(`[DEBUG authStore] setPremiumStatus called with: ${isPremiumStatus}`);
    set({ isPremium: isPremiumStatus });
  },
  setUserAndSession: (user, session) => {
    // console.log(
    //   `[DEBUG authStore] setUserAndSession called. User: ${user ? user.id : 'null'}, Session: ${session ? 'Exists' : 'null'}`
    // );
    set({ isLoading: false, session, user });
  },
  user: null,
}));

// console.log('[NovaKit] Zustand authStore (src/store/authStore.ts) initialized.');
