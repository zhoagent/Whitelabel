/**
 * @fileoverview Provides a reusable, themeable Icon component using react-native-svg and NativeWind.
 * @description This component renders SVG icons imported as React components. It allows dynamic sizing and coloring via props and NativeWind utility classes, ensuring visual consistency and scalability. This is essential for brand expression (status) and user interface clarity (attraction, usability). Built for React Native 0.79, Expo 53, ESM, and pnpm.
 *
 * Key features using the stack:
 * - Renders SVGs using \`react-native-svg\`.
 * - Allows selection of icons via a type-safe \`name\` prop.
 * - Supports dynamic \`size\` and \`color\` props.
 * - Integrates with NativeWind: \`className\` prop can be used to apply text color utilities (e.g., \`text-primary\`) which are inherited by SVGs using \`fill="currentColor"\`.
 * - Centralizes icon management for easier updates and theming.
 * - Uses an \`@assets/\` path alias for robust SVG source file resolution.
 *
 * @dependencies
 * - \`react\`
 * - \`react-native-svg\`
 * - SVG files from \`@assets/icons/\` (e.g., \`@assets/icons/home.svg\`)
 *
 * @props
 * - name {IconName}: The specific name of the icon to render.
 * - size {number} (optional): The width and height of the icon. Defaults to 24.
 * - color {string} (optional): A fallback color for the icon if not provided by NativeWind's text utilities via \`className\`.
 * - className {string} (optional): NativeWind utility classes to style the icon, primarily for color.
 * - All other SvgProps from \`react-native-svg\`.
 *
 * @notes
 * - SVGs should use \`fill="currentColor"\` or \`stroke="currentColor"\` on relevant paths to inherit color from NativeWind text utilities.
 * - This component leverages the existing SVG setup (module declaration in \`app-env.d.ts\` and transformer in \`metro.config.cjs\`).
 * - React Compiler friendly due to its simple structure and prop handling.
 * - The \`@assets/\` import paths require configuration in \`babel.config.js\` and \`tsconfig.json\`.
 */

// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
import React from 'react';
import { SvgProps } from 'react-native-svg';
// Import your SVG components using the @assets alias.
// This requires configuring \`@assets\` in babel.config.js and tsconfig.json to point to './assets'
import HomeSvg from '@assets/icons/home.svg';
import SettingsSvg from '@assets/icons/settings.svg';
// Add other icon imports here:
// import ProfileSvg from '@assets/icons/profile.svg';
// import SearchSvg from '@assets/icons/search.svg';

export type IconName =
  | 'home'
  | 'settings';
  // Add other icon names here as they are created:
  // | 'profile'
  // | 'search';

export interface IconProps extends Omit<SvgProps, 'color'> {
  className?: string; // For NativeWind styling, primarily text color.
  color?: string; // Explicit color prop, can be overridden by className text color if SVG uses currentColor
  name: IconName;
  size?: number;
}

// The imported SVG components (HomeSvg, SettingsSvg, etc.) can accept className directly
// when NativeWind's Babel plugin is configured with jsxImportSource: 'nativewind'.

const iconMap: Record<IconName, React.ComponentType<SvgProps>> = {
  home: HomeSvg,
  settings: SettingsSvg,
  // profile: ProfileSvg, // Ensure these are imported if uncommented
  // search: SearchSvg,  // Ensure these are imported if uncommented
};

export const Icon = ({
  className, // NativeWind classes
  color, // Explicit color prop for SvgProps if SVG doesn't use currentColor well with NativeWind
  name,
  size = 24,
  ...props // Other SvgProps like strokeWidth, fillRule etc.
}: IconProps) => {
  const SvgComponent = iconMap[name];

  if (!SvgComponent) {
    // console.warn(\`[IconComponent] Icon not found: \${name}\`);
    return null; // Or render a placeholder/default icon
  }

  return (
    <SvgComponent
      className={className} // Pass className for NativeWind to process (e.g., text-primary)
      color={color} // Pass explicit color. NativeWind \`text-*\` in \`className\` usually takes precedence for \`currentColor\` in SVG.
      height={size}
      width={size}
      {...props}
    />
  );
};
