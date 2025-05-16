/**
@fileoverview Provides a custom, themeable, and internationalized Bottom Tab Bar for Expo Router.
@description This component renders a custom tab bar UI using NativeWind for styling, react-native-svg (via the Icon component from '@/components/core/Icon') for icons, and fbtee for internationalized labels. It's designed to be highly customizable and integrate seamlessly with Expo Router's tab navigation. A well-designed tab bar is crucial for intuitive navigation, directly impacting user engagement and ease of access to key app features (self-improvement, entertainment, status). Built for React Native 0.79, Expo 53, ESM, and pnpm.
Key features using the stack:
Integrates with Expo Router's <Tabs> navigator via the tabBar prop.
Styled with NativeWind utility classes for a consistent look and feel.
Uses the custom Icon component (which internally uses react-native-svg) for scalable and themeable tab icons.
Tab labels are internationalized using fbtee, ensuring global reach and user comfort.
Dynamically determines active tab state for visual feedback, enhancing usability.
@dependencies
@react-navigation/bottom-tabs (types for BottomTabBarProps)
expo-router
fbtee
react, react-native
'@/components/core/Icon.tsx'
'@/components/core/Text.tsx'
@notes
The tabRoutes array defines the configuration for each tab, including name, href, icon, default label, and the i18n key (description) for fbtee.
Active tab styling (e.g., text-primary) uses NativeWind classes, enhancing visual feedback and brand consistency.
React Compiler friendly due to functional component structure and memoization where appropriate.
*/
// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Link } from 'expo-router';
import { fbs } from 'fbtee';
import React from 'react';
import { Pressable, View } from 'react-native';
import { Icon, type IconName } from '@/components/core/Icon.tsx';
import { Text } from '@/components/core/Text.tsx';

interface TabRouteConfig {
  defaultLabel: string;
  href: string;
  i18nKey: string;
  icon: IconName;
  name: string;
}

const tabRoutes: ReadonlyArray<TabRouteConfig> = [
  {
    defaultLabel: 'Home',
    href: '/(app)/(tabs)/',
    i18nKey: 'tab_bar_home_label_desc',
    icon: 'home',
    name: 'index',
  },
  {
    defaultLabel: 'Settings',
    href: '/(app)/(tabs)/two',
    i18nKey: 'tab_bar_settings_label_desc',
    icon: 'settings',
    name: 'two',
  },
];

interface TabBarItemProps {
  descriptor: BottomTabBarProps['descriptors'][string];
  isFocused: boolean;
  navigation: BottomTabBarProps['navigation'];
  route: BottomTabBarProps['state']['routes'][number];
  tabConfig: TabRouteConfig;
}

function TabBarItem({
  descriptor,
  isFocused,
  navigation,
  route,
  tabConfig,
}: TabBarItemProps) {
  const { options } = descriptor;

  const onPress = () => {
    const event = navigation.emit({
      canPreventDefault: true,
      target: route.key,
      type: 'tabPress',
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const onLongPress = () => {
    navigation.emit({
      target: route.key,
      type: 'tabLongPress',
    });
  };

  const accessibilityLabel =
    options.tabBarAccessibilityLabel ??
    options.title ??
    tabConfig.defaultLabel;

  const translatedLabel = React.useMemo(() => {
    return fbs(tabConfig.defaultLabel, tabConfig.i18nKey);
  }, [tabConfig.defaultLabel, tabConfig.i18nKey]);

  return (
    <Link
      asChild
      href={tabConfig.href as any} // Kept as any from original for now
      key={route.key}
    >
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        className="flex-1 items-center justify-center py-1"
        onLongPress={onLongPress}
        onPress={onPress}
      >
        <Icon
          className={
            isFocused
              ? 'text-primary'
              : 'text-neutral-500 dark:text-neutral-400'
          }
          name={tabConfig.icon}
          size={24}
        />
        <Text
          className={`text-xs mt-0.5 ${
            isFocused ? 'text-primary font-semibold' : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          {translatedLabel}
        </Text>
      </Pressable>
    </Link>
  );
}

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View className="flex-row h-16 bg-background border-t border-neutral-200 dark:border-neutral-700 shadow-md">
      {state.routes.map((route: BottomTabBarProps['state']['routes'][number], index: number) => {
        const descriptor = descriptors[route.key];
        const tabConfig = tabRoutes.find((r) => r.name === route.name);

        if (!tabConfig) {
          return null;
        }
        const isFocused = state.index === index;

        return (
          <TabBarItem
            descriptor={descriptor}
            isFocused={isFocused}
            key={route.key}
            navigation={navigation}
            route={route}
            tabConfig={tabConfig}
          />
        );
      })}
    </View>
  );
}
// END WRITING FILE CODE
