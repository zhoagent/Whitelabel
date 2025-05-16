/**
@fileoverview Provides a reusable, themed Button component.
@description This component wraps the React Native Pressable, adding predefined variants, loading state, and icon support, all styled with NativeWind. It's built for React Native 0.79, Expo 53, using TypeScript, ESM, and pnpm. This component is vital for creating clear calls-to-action and interactive elements, directly impacting user engagement and conversion.
Key features using the stack:
Styled with NativeWind using className prop and cx (from 'lib/cx') for class merging.
Supports variant props ('primary', 'secondary', 'outline', 'ghost', 'danger') for different visual styles defined via NativeWind classes.
Handles isLoading state by showing an ActivityIndicator and disabling the button.
Allows optional iconLeft and iconRight React nodes.
Built with TypeScript for type safety.
Uses theme colors from 'styles/theme' for consistent branding.
@dependencies
React
{ ActivityIndicator, Pressable, View, type PressableProps } from 'react-native'
'components/core/Text' (Custom Text component)
'lib/cx' (Classnames utility)
'styles/theme' (App color palette, specifically appColors for ActivityIndicator)
@props
iconLeft {React.ReactNode} (optional): Icon to display to the left of the button text/children.
iconRight {React.ReactNode} (optional): Icon to display to the right of the button text/children.
isLoading {boolean} (optional): If true, shows a loading indicator and disables the button. Defaults to false.
textClassName {string} (optional): NativeWind classes for the button's text (if title or children is a string).
title {string} (optional): Text to display on the button. Overridden by children if both are provided.
variant {'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'} (optional): Predefined button style variant. Defaults to 'primary'.
All other standard PressableProps.
@monetizationHooks
Buttons are the primary interaction points for triggering premium feature purchases, sign-ups, or other conversion events. Variants like 'primary' can be used for high-priority CTAs, visually guiding users towards monetizable actions.
@notes
The ActivityIndicator color is dynamically chosen based on the button variant for better contrast and visual appeal.
This component is React Compiler friendly.
*/
// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  View,
} from 'react-native';
import { Text } from '@/components/core/Text';
import { cx } from '@/lib/cx';
import { appColors } from '@/styles/theme';

export interface ButtonProps extends PressableProps {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
  textClassName?: string;
  title?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
}

export const Button = ({
  children,
  className,
  disabled,
  iconLeft,
  iconRight,
  isLoading = false,
  textClassName,
  title,
  variant = 'primary',
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;

  const baseStyle =
    'py-3 px-6 rounded-lg items-center justify-center flex-row min-h-[50px]';

  const variantStyles = {
    danger: 'bg-error active:opacity-80',
    ghost: 'active:bg-neutral-500/10 dark:active:bg-neutral-500/20',
    outline:
      'border border-primary active:bg-primary/10 dark:active:bg-primary/20',
    primary: 'bg-primary active:bg-primaryFocus',
    secondary: 'bg-secondary active:opacity-80',
  };

  const textVariantStyles = {
    danger: 'text-white font-semibold',
    ghost: 'text-primary font-semibold',
    outline: 'text-primary font-semibold',
    primary: 'text-white font-semibold',
    secondary: 'text-white font-semibold',
  };

  const activityIndicatorColor = () => {
    if (variant === 'primary' || variant === 'secondary' || variant === 'danger') {
      return appColors.brand?.white || '#FFFFFF'; // Fallback to white
    }
    return appColors.primary;
  };

  return (
    <Pressable
      className={cx(
        baseStyle,
        variantStyles[variant],
        isDisabled && 'opacity-50',
        className,
      )}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={activityIndicatorColor()} size="small" />
      ) : (
        <>
          {iconLeft && <View className="mr-2">{iconLeft}</View>}
          {children ||
            (title && (
              <Text
                className={cx(textVariantStyles[variant], textClassName)}
                variant="body" // Default variant, can be overridden by textClassName
              >
                {title}
              </Text>
            ))}
          {iconRight && <View className="ml-2">{iconRight}</View>}
        </>
      )}
    </Pressable>
  );
};
// END WRITING FILE CODE
