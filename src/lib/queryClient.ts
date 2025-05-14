/**
 * @fileoverview Initializes and configures the TanStack Query client.
 * @description This module provides a singleton instance of `QueryClient` with default options optimized for performance and responsiveness in a React Native 0.79 / Expo 53 application using Supabase as a backend. It's a core part of the data fetching strategy, enabling efficient caching, background updates, and server state management.
 *
 * Key features using the stack:
 * - Instantiates `QueryClient` from `@tanstack/react-query`.
 * - Sets default `staleTime` to 5 minutes, ensuring data is considered fresh for a reasonable period, reducing immediate refetches.
 * - Sets default `gcTime` (garbage collection time) to 30 minutes, keeping inactive query data in cache longer for potential reuse.
 * - Configures `retry: 1` for queries, allowing one automatic retry on failure, improving resilience against transient network issues with Supabase.
 * - This client will be provided to the application via `QueryClientProvider` in the root layout.
 *
 * @dependencies
 * - `@tanstack/react-query`
 *
 * @returns
 * - Exports the configured `queryClient` instance.
 *
 * @notes
 * - These default options can be overridden on a per-query basis if specific needs arise.
 * - Effective caching strategies are vital for creating a smooth user experience and minimizing backend load on Supabase.
 * - This setup is foundational for building performant, data-driven features that can hook users (e.g., real-time leaderboards, up-to-date content) and support monetization strategies (e.g., gating content based on server-validated subscriptions).
 */

// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query Client instance.
 * Configured with default options for optimal performance and responsiveness
 * when interacting with Supabase or other backend services.
 *
 * - `staleTime`: 5 minutes. Data is considered fresh for this duration, preventing unnecessary refetches.
 *   This improves perceived performance and reduces load on the Supabase backend.
 * - `gcTime`: 30 minutes. Inactive queries are garbage collected after this duration.
 *   Longer gcTime can improve UX if users frequently navigate back to previously visited screens.
 * - `retry`: 1. Failed queries will be retried once automatically.
 *   This adds resilience against minor network interruptions.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1, // Retry failed requests once
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// For development verification, you might want to log successful initialization
// console.log('[NovaKit] TanStack Query client initialized.');
// END WRITING FILE CODE
