import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Redirect, Stack } from 'expo-router';
import { Fragment } from 'react/jsx-runtime';
import { useAuthStore } from '../../store/authStore.ts'; // Import useAuthStore
import useViewerContext from '../../user/useViewerContext.tsx'; // Keep for locale if needed

export default function TabLayout() {
  const session = useAuthStore((state) => state.session);
  const isLoadingAuth = useAuthStore((state) => state.isLoading); // Get loading state
  const { locale } = useViewerContext(); // Still use this for locale if necessary

  // Wait for initial auth check to complete
  if (isLoadingAuth) {
    // Optionally, render a loading indicator specific to this layout
    // For now, returning null will let the global loading indicator in RootLayout handle it
    // or just show a blank screen briefly.
    return null;
  }

  if (!session) { // Check session from useAuthStore
    return <Redirect href="/login" />;
  }

  return (
    <Fragment key={locale}>
      <BottomSheetModalProvider>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              contentStyle: {
                backgroundColor: 'transparent',
              },
              headerShown: false,
            }}
          />
        </Stack>
      </BottomSheetModalProvider>
    </Fragment>
  );
}
