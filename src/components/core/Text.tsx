/**
 * @fileoverview A custom Text component for the application, styled with NativeWind.
 * @description This component wraps the React Native Text component, providing default styling (e.g., text color from CSS variables for theming) and allowing further customization via `className`. Consistent typography is key to a professional look and feel (attraction, status) and aids readability (self-improvement, entertainment).
 *
 * Key features using the stack:
 * - Wraps `react-native`'s `Text` component.
 * - Styled using NativeWind `className` prop.
 * - Uses `cx` (classnames utility) for conditional class application.
 * - Designed to pick up theme-based text color from CSS variables (e.g., `var(--text)`).
 *
 * @dependencies
 * - `react`
 * - `react-native`
 * - 'lib/cx.tsx' (classnames utility)
 *
 * @props
 * - children {ReactNode}: The content to be rendered inside the text component.
 * - className {string} (optional): Additional NativeWind classes for styling.
 * - All other `TextProps` from `react-native`.
 *
 * @notes
 * - This component ensures that text styling is consistent and themeable across the app.
 * - The `color-[var(--text)]` class ensures it adapts to light/dark mode themes defined in `tailwind.config.ts`.
 */
import { ReactNode } from 'react';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { Text as ReactNativeText, TextProps } from 'react-native';
import { cx } from '../../lib/cx.tsx';

export default function Text({
  children,
  className,
  style,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & TextProps) {
  return (
    <ReactNativeText
      className={cx('color-[var(--text)]', className)}
      style={[style]}
      {...props}
    >
      {children}
    </ReactNativeText>
  );
}
