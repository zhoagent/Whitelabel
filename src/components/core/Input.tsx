/**
@fileoverview Provides a reusable, themed Input component for text entry.
@description This component wraps the React Native TextInput, adding consistent styling via NativeWind, label support, error display, and optional icons. It's designed for React Native 0.79, Expo 53, using TypeScript, ESM, and pnpm. High-quality input fields are essential for user onboarding, data entry, and overall app usability, contributing to a positive user experience.
Key features using the stack:
Styled with NativeWind for a consistent look and feel, leveraging tailwind.config.ts and theme colors from '@/styles/theme'.
Supports labels, error messages, and optional left/right icons.
Handles focus states for enhanced visual feedback (attraction).
Built with TypeScript for type safety.
Uses cx utility from '@/lib/cx' for conditional class application.
@dependencies
React, { useState }
{ TextInput, View, Platform, type TextInputProps } from 'react-native'
'@/components/core/Text' (Custom Text component)
'@/lib/cx' (Classnames utility)
'@/styles/theme' (App color palette)
@props
containerClassName {string} (optional): NativeWind classes for the outermost container.
error {string} (optional): Error message to display below the input.
inputClassName {string} (optional): NativeWind classes for the TextInput element itself.
label {string} (optional): Text label displayed above the input.
leftIcon {React.ReactNode} (optional): Icon to display to the left of the input text.
rightIcon {React.ReactNode} (optional): Icon to display to the right of the input text.
All other standard TextInputProps.
@monetizationHooks
Inputs are fundamental to capturing user data that can lead to upselling opportunities, e.g., collecting preferences that inform targeted offers for premium features related to self-improvement or status enhancement, with data stored and processed via Supabase.
@nativewind specific
Uses dynamic border styling based on focus and error states, applied via NativeWind classes through the cx utility.
placeholderTextColor is handled differently for web to ensure consistency.
Selection color is customized for better UX, aligning with app branding from '@/styles/theme'.
@notes
Clear and usable input fields are critical for user onboarding, data entry for core app functions, and overall user satisfaction.
This component is React Compiler friendly.
*/
// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
import React, { useState } from 'react';
import {
  TextInput,
  type TextInputProps,
  View,
  Platform,
} from 'react-native';
import { Text } from './Text.tsx';
import { cx } from '../../lib/cx.tsx';
import { appColors } from '../../styles/theme.ts';

export interface InputProps extends TextInputProps {
  containerClassName?: string;
  error?: string;
  inputClassName?: string;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = ({
  containerClassName,
  error,
  inputClassName,
  label,
  leftIcon,
  onBlur,
  onFocus,
  rightIcon,
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const baseInputStyle =
    'flex-1 py-3 text-base bg-transparent text-text placeholder-neutral-500 dark:placeholder-neutral-400 min-h-[48px]';
  const inputWrapperBaseStyle =
    'flex-row items-center border rounded-lg bg-background'; // bg-background to ensure children don't make it transparent

  const errorBorderStyle = 'border-error';
  const focusedBorderStyle = 'border-primary';
  const defaultBorderStyle = 'border-neutral-300 dark:border-neutral-700';

  const handleFocus: TextInputProps['onFocus'] = (e) => {
    setIsFocused(true);
    if (onFocus) {
      onFocus(e);
    }
  };

  const handleBlur: TextInputProps['onBlur'] = (e) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <View className={cx('mb-4', containerClassName)}>
      {label && (
        <Text className="mb-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300" variant="label">
          {label}
        </Text>
      )}
      <View
        className={cx(
          inputWrapperBaseStyle,
          error
            ? errorBorderStyle
            : isFocused
            ? focusedBorderStyle
            : defaultBorderStyle,
        )}
      >
        {leftIcon && <View className="pl-3 pr-2 items-center justify-center">{leftIcon}</View>}
        <TextInput
          className={cx(
            baseInputStyle,
            leftIcon ? '' : 'pl-4',
            rightIcon ? '' : 'pr-4',
            inputClassName,
          )}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholderTextColor={Platform.OS === 'web' ? appColors.neutral[500] : (appColors.neutral[400] as any)} // Cast for now
          selectionColor={appColors.primary}
          {...props}
        />
        {rightIcon && <View className="pr-3 pl-2 items-center justify-center">{rightIcon}</View>}
      </View>
      {error && (
        <Text className="mt-1.5 text-error" variant="caption">
          {error}
        </Text>
      )}
    </View>
  );
};
// END WRITING FILE CODE
