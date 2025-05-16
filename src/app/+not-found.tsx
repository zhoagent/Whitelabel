/**
@fileoverview Provides a user-friendly screen for handling 404 Not Found errors.
@description This screen is displayed when a user navigates to a non-existent route. It uses Expo Router for screen options and navigation, fbtee for internationalized text, and NativeWind for styling.
Key features using the stack:
Uses Expo Router's <Stack.Screen> for setting the title and <Link> for navigation.
Text content is internationalized using fbtee for broader appeal.
Styled with NativeWind utility classes from '@/components/core/Text'.
@dependencies
expo-router
fbtee
react-native (View)
'@/components/core/Text'
@notes
Providing a clear path back to the home screen enhances user experience when they encounter an invalid URL.
*/
// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
import { Link, Stack } from 'expo-router';
import { fbt } from 'fbtee';
import { View } from 'react-native';
import { Text } from '../components/core/Text.tsx'; // Changed to relative path with .tsx extension

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: String(fbt('Oops!', 'Not found screen header title')) }} />
      <View className="flex-1 items-center justify-center p-5 bg-background">
        <Text className="text-lg font-bold text-text">
          <fbt desc="Screen not found title">
            This screen doesn't exist.
          </fbt>
        </Text>
        <Link className="mt-4 pt-4" href="/">
          <Text className="text-base text-primary active:opacity-70">
            <fbt desc="Go back link">Go to home screen!</fbt>
          </Text>
        </Link>
      </View>
    </>
  );
}
// END WRITING FILE CODE
