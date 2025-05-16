/**
@fileoverview The main home screen of the application within the authenticated tabs.
@description This screen serves as the primary landing page after authentication. It uses Expo Router for screen options and fbtee for internationalized text. Styling is done with NativeWind. Built for React Native 0.79, Expo 53, using TypeScript, ESM, and pnpm. This screen is a key touchpoint for demonstrating the app's core value and drawing users into engagement loops.
Key features using the stack:
Defines screen options (e.g., header title) using Expo Router's <Stack.Screen>.
Uses fbtee for all user-facing strings, enabling localization for broader user attraction.
Styled with NativeWind utility classes for a modern UI, enhancing visual appeal.
The <fbt> component wraps translatable strings, integrating with the i18n pipeline.
@dependencies
expo-router
fbtee
react-native (View)
'components/core/Text.tsx' (see below for file content)
@notes
The color-purple (primary) NativeWind class used for the "Welcome" text implies a custom color definition in tailwind.config.ts, contributing to brand identity and attraction.
This screen is a prime candidate for displaying dynamic content fetched from Supabase via TanStack Query, driving user engagement and potentially showcasing status-enhancing elements or self-improvement progress.
*/
// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
import { Stack } from 'expo-router';
// @ts-ignore FBT is used as a JSX tag, and noUnusedLocals flags it.
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars -- Attempting to silence persistent fbt warning
import { fbt, fbs } from 'fbtee';
import { View } from 'react-native';
import { Text } from '../../../components/core/Text.tsx';

export default function Index() {
  return (
    <>
      <Stack.Screen
        options={{ title: String(fbs('Home', 'Home header title')) }}
      />
      <View className="flex-col flex-1 items-center justify-center gap-4 p-4 bg-background">
        <Text className="text-center text-xl font-bold text-primary">
          <fbt desc="Greeting">Welcome to NovaKit!</fbt>
        </Text>
        <Text className="text-center text-text">
          <fbt desc="Tagline">Modern, sensible defaults, fast.</fbt>
        </Text>
        <View className="flex-row items-center justify-center gap-1">
          <Text className="text-center text-text">
            <fbt desc="Live update message">
              Change{' '}
              <View className="border-hairline translate-y-[2px] rounded border-primary bg-neutral-100 dark:bg-neutral-800 p-1">
                <Text className="text-xs text-primary">src/app/(app)/(tabs)/index.tsx</Text>
              </View>{' '}
              for live updates.
            </fbt>
          </Text>
        </View>
      </View>
    </>
  );
}
// END WRITING FILE CODE
