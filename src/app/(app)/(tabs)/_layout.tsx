/**
@fileoverview Layout for the main tab navigation within the authenticated app.
@description This component uses Expo Router's <Tabs> navigator to define the tab structure. It includes a custom tab bar and a temporary header button for locale switching (to be refactored to a settings screen). Built for React Native 0.79, Expo 53, using TypeScript, ESM, and pnpm. This layout is central to user navigation, guiding them to key engagement and value-driving sections of the application.
Key features using the stack:
Uses Expo Router <Tabs> for tab-based navigation.
Integrates a CustomTabBar component for a branded and themeable tab UI (NativeWind, SVG Icons from '../../../components/core/Icon.tsx').
Uses fbtee for internationalized tab titles and header titles, enhancing global appeal.
Temporarily uses useViewerContext for locale switching; this logic is slated to move to a Zustand settingsStore and a dedicated settings screen for better state management and user self-improvement (customization).
@dependencies
@react-navigation/bottom-tabs (types for BottomTabBarProps)
expo-router
fbtee
{ Pressable, View } from 'react-native'
'../../../components/layout/CustomTabBar.tsx'
'../../../components/core/Text.tsx'
'../../../lib/i18n/getLocale.tsx'
'../../../user/useViewerContext.tsx'
'../../../styles/theme.ts'
@notes
The sceneStyle: { backgroundColor: 'transparent' } on <Tabs> can be useful if page backgrounds are handled individually or by a higher-level layout.
Transitioning locale switching to a dedicated settings screen and settingsStore (Zustand) will align better with the target architecture for enhanced scalability and UX.
This file is critical for the app's main navigation structure, directly impacting user experience and flow towards monetizable features or engagement loops.
*/
// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { fbs } from 'fbtee';
import { Pressable, View } from 'react-native';
import { Text } from '../../../components/core/Text.tsx'; // Relative path is fine here
import { CustomTabBar } from '../../../components/layout/CustomTabBar.tsx'; // Relative path is fine here
import getLocale from '../../../lib/i18n/getLocale.tsx'; // Relative path is fine here
import useViewerContext from '../../../user/useViewerContext.tsx'; // Relative path is fine here
import { appColors } from '../../../styles/theme.ts'; // Relative path is fine here

export default function TabLayout() {
  const { locale, setLocale } = useViewerContext();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: appColors.neutral[50], // Use direct color for simplicity now
        },
        headerTintColor: appColors.neutral[900], // Use direct color
        headerTitleStyle: {
          // fontFamily: 'Inter-Bold', // Removed custom font
        },
        sceneContainerStyle: {
          // backgroundColor: 'transparent', // Allow individual screens to control their background
        },
      }}
      tabBar={(props: BottomTabBarProps) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerRight: () => (
            <Pressable
              className="mr-3 p-2 rounded-md active:bg-neutral-200 dark:active:bg-neutral-700"
              onPress={() => setLocale(locale === 'ja_JP' ? 'en_US' : 'ja_JP')}
            >
              <View>
                <Text className="text-text text-sm font-medium">
                  {getLocale().split(/[_-]/)[0].toUpperCase()}
                </Text>
              </View>
            </Pressable>
          ),
          title: String(fbs('Home', 'Home header title')),
        }}
      />
      <Tabs.Screen
        name="two" // This screen will later become settings.
        options={{
          title: String(fbs('Settings', 'Settings header title')),
        }}
      />
    </Tabs>
  );
}
// END WRITING FILE CODE
