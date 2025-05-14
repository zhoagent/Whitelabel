/**
 * @fileoverview Layout for the main tab navigation within the authenticated app section.
 * @description Defines the tab structure (e.g., Home, Two/Settings) using Expo Router's `<Tabs>`. It includes an example of a header right component for locale switching, leveraging `fbtee` and `useViewerContext`. This layout is central to user navigation and experience within the core app.
 *
 * Key features using the stack:
 * - Uses Expo Router `<Tabs>` for tab-based navigation.
 * - Demonstrates dynamic header elements (`headerRight`) for actions like locale switching.
 * - Integrates `fbtee` for localized tab titles and UI text.
 * - Uses `@expo/vector-icons` (AntDesign) for tab icons (planned for replacement with custom SVGs).
 * - Styled with NativeWind `className` and direct style props where necessary.
 *
 * @dependencies
 * - `@expo/vector-icons/AntDesign`
 * - `expo-router`
 * - `fbtee`
 * - `react`
 * - `react-native`
 * - '@/lib/i18n/getLocale'
 * - '@/styles/theme'
 * - '@/components/core/Text'
 * - '@/user/useViewerContext'
 *
 * @notes
 * - The AntDesign icons are a temporary measure; the strategic goal is to use custom, themeable SVG icons for enhanced brand expression (attraction, status).
 * - Locale switching directly impacts user comfort and accessibility.
 */
import _AntDesign from '@expo/vector-icons/AntDesign.js';
import { Tabs } from 'expo-router';
import { fbs } from 'fbtee';
import { FC } from 'react';
import { Pressable, View } from 'react-native';
import getLocale from '@/lib/i18n/getLocale';
import colors from '@/styles/theme';
import Text from '@/components/core/Text';
import useViewerContext from '@/user/useViewerContext';

// Types in `@expo/vector-icons` do not currently work correctly in `"type": "module"` packages.
const AntDesign = _AntDesign as unknown as FC<{
  color: string;
  name: string;
  size: number;
}>;

export default function TabLayout() {
  const { locale, setLocale } = useViewerContext();

  return (
    <Tabs
      screenOptions={{
        sceneStyle: {
          backgroundColor: 'transparent',
        },
        tabBarActiveTintColor: colors.purple,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerRight: () => (
            <Pressable
              className="mr-2 rounded px-4 py-0"
              onPress={() => setLocale(locale === 'ja_JP' ? 'en_US' : 'ja_JP')}
            >
              {({ pressed }) => (
                <View
                  style={{
                    opacity: pressed ? 0.5 : 1,
                  }}
                >
                  <Text>{getLocale().split('_')[0]}</Text>
                </View>
              )}
            </Pressable>
          ),
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <AntDesign
              color={focused ? colors.purple : colors.black}
              name="ie"
              size={24}
            />
          ),
          title: String(fbs('Home', 'Home tab title')),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <AntDesign
              color={focused ? colors.purple : colors.black}
              name="printer"
              size={24}
            />
          ),
          title: String(fbs('Two', 'Two tab title')),
        }}
      />
    </Tabs>
  );
}
