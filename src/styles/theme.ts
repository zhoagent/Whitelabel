/**
 * @fileoverview Defines the application's core color palette.
 * @description This file exports a `colors` object and a `ColorName` type. These colors will be integrated into `tailwind.config.ts` to provide a consistent, themeable styling foundation for NativeWind. A strong color palette enhances visual appeal (attraction) and brand identity (status).
 *
 * Key features using the stack:
 * - Defines a simple, extendable color object.
 * - Provides a TypeScript type for color names, ensuring type safety.
 *
 * @notes
 * - This is the source of truth for app-specific colors used in NativeWind configuration.
 * - The plan is to expand this to include semantic color names (primary, secondary, background, text) and CSS variable placeholders for dynamic theming as per Spec section 7.1. For this move, the content remains as is, but its role will evolve.
 */
const colors = {
  black: '#111',
  grey: '#ededed',
  purple: '#7e22ce',
  white: '#fff',
};

export type ColorName = keyof typeof colors;

export default colors;
