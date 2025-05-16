/**
@fileoverview Placeholder screen for "Settings", currently providing a Logout button.
@description This screen, part of the authenticated tab layout, will eventually house app settings. For now, it demonstrates logout functionality using the Zustand authStore. Built for React Native 0.79, Expo 53, using TypeScript, ESM, and pnpm. Secure logout is essential for user trust and data protection.
Key features using the stack:
Uses the Zustand authStore (from 'store/authStore') for accessing the clearAuth (logout) action.
Styled with NativeWind utility classes.
Text is internationalized using fbtee for a consistent localized experience.
@dependencies
fbtee
react-native (View)
'components/core/Text'
'store/authStore'
@notes
The logout action relies on the onAuthStateChange listener (typically in 'app/_layout.tsx' or an AuthStateSyncer) to handle the actual Supabase sign-out and navigation, which is a core part of the user session management strategy.
This screen will be expanded into a full settings module, allowing users to manage preferences (e.g., theme, language), which enhances the self-improvement and personalization aspects of the app, potentially unlocking premium customization options.
*/
// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
// @ts-ignore
import { fbt } from 'fbtee';
import { View } from 'react-native';
import { Text } from '../../../components/core/Text.tsx';
import { useAuthStore } from '../../../store/authStore.ts';

export default function Two() {
  const { clearAuth: logout } = useAuthStore();

  return (
    <View className="flex-col flex-1 items-center justify-center p-4 bg-background">
      <Text className="text-lg text-primary active:opacity-70" onPress={logout}>
        <fbt desc="Logout button text">Logout</fbt>
      </Text>
    </View>
  );
}
// END WRITING FILE CODE
