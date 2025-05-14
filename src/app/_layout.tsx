// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
import '@/lib/polyfills'; // CRITICAL: Import polyfills first for Supabase and other libraries.
import '@/lib/i18n/setup'; // Setup fbtee for internationalization.
import 'global.css'; // Import NativeWind global styles.

import { Slot } from 'expo-router';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient.ts'; // The configured QueryClient
import { ViewerContext } from '@/user/useViewerContext.tsx'; // Using @/ alias

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(app)',
};

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ViewerContext>
        <GestureHandlerRootView style={{ flex: 1 }}>
          {/*
          NativeWind styling: `flex-col` is correct for column direction.
          `p-0` is valid. The `flex-1` on GestureHandlerRootView and this View ensures full screen coverage.
        */}
          <View className="flex-col flex-1 p-0">
            <Slot />
          </View>
        </GestureHandlerRootView>
      </ViewerContext>
    </QueryClientProvider>
  );
}
// END WRITING FILE CODE
