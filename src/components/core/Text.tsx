/**
@fileoverview Provides a reusable, themed Text component.
@description This component wraps the React Native Text component, adding predefined variants (e.g., heading1, body, caption) styled with NativeWind for consistent typography across the application. It's built for React Native 0.79, Expo 53, using TypeScript, ESM, and pnpm. Consistent and legible text is crucial for user experience and conveying information effectively.
Key features using the stack:
Styled with NativeWind using className prop and cx (from '../../lib/cx.tsx') for class merging.
Defines common text variant props for easy application of typographic styles from tailwind.config.ts.
Base styles ensure theme-aware text color (text-text) and default font family (font-sans).
Built with TypeScript for type safety.
@dependencies
{ Text as RNText, type TextProps as RNTextProps } from 'react-native'
'lib/cx.tsx' (Classnames utility)
@props
variant {'heading1' | 'heading2' | 'body' | 'caption' | 'label'} (optional): Predefined text style variant. Defaults to 'body'.
All other standard RNTextProps.
@notes
Consistent typography is key to a professional look and feel (attraction, status) and overall app usability.
Font families (font-sans, font-heading) and text colors (text-text) are defined in tailwind.config.ts, leveraging CSS variables for theming.
This component is React Compiler friendly.
*/
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { cx } from '../../lib/cx.tsx';

export interface TextProps extends RNTextProps {
  variant?: 'heading1' | 'heading2' | 'body' | 'caption' | 'label';
}

export const Text = ({ // Named export
  className,
  variant = 'body',
  ...props
}: TextProps) => {
  const variantClasses = {
    body: 'text-base font-sans',
    caption: 'text-sm font-sans text-neutral-600 dark:text-neutral-400',
    heading1: 'text-3xl font-heading font-bold',
    heading2: 'text-2xl font-heading font-semibold',
    label: 'text-sm font-sans font-medium text-neutral-700 dark:text-neutral-300',
  }[variant];

  return (
    <RNText
      className={cx(
        'text-text font-sans', // Base styles: theme-aware text color and default font
        variantClasses,
        className,
      )}
      {...props}
    />
  );
};
// END WRITING FILE CODE
