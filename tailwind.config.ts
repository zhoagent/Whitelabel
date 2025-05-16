// @ts-expect-error This file does not have type definitions for the preset.
import nativewindPreset from 'nativewind/dist/tailwind/index.js';
import type { Config } from 'tailwindcss';
import type { CSSRuleObject } from 'tailwindcss/types/config.d.ts';
import { appColors } from './src/styles/theme.ts'; // Adjusted import

export default {
  content: ['./src/**/*.{js,ts,tsx}'],
  plugins: [
    ({
      addBase,
    }: {
      addBase: (base: CSSRuleObject | Array<CSSRuleObject>) => void;
    }) => {
      const lightVars: Record<string, string> = {
        '--color-accent': appColors.accent,
        '--color-background': appColors.neutral[50], // e.g., white/very light grey
        '--color-error': appColors.error,
        '--color-foreground': appColors.neutral[900], // e.g., black/very dark grey (for card backgrounds on light bg)
        '--color-primary': appColors.primary,
        '--color-primary-focus': appColors.primaryFocus,
        '--color-secondary': appColors.secondary,
        '--color-success': appColors.success,
        '--color-text': appColors.neutral[900], // e.g., black/very dark grey
        '--color-warning': appColors.warning,
      };
      const darkVars: Record<string, string> = {
        '--color-accent': appColors.accent, // Or a specific appColors.accentDark
        '--color-background': appColors.neutral[950], // e.g., near black
        '--color-error': appColors.error,
        '--color-foreground': appColors.neutral[100], // e.g., very light grey (for card backgrounds on dark bg)
        // Primary/secondary/accent might need dark variants or could be the same
        '--color-primary': appColors.primary, // Or a specific appColors.primaryDark
        '--color-primary-focus': appColors.primaryFocus, // Or a specific appColors.primaryDarkFocus
        '--color-secondary': appColors.secondary, // Or a specific appColors.secondaryDark
        '--color-success': appColors.success, // Could have dark theme adaptations
        '--color-text': appColors.neutral[100],       // e.g., white/very light grey
        '--color-warning': appColors.warning,
      };

      addBase({
        '.dark': darkVars,
        ':root': lightVars,
      });
    },
  ],
  presets: [nativewindPreset],
  theme: {
    extend: {
      colors: {
        // Map semantic colors to CSS variables for dynamic theming
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        brand: appColors.brand,
        error: 'var(--color-error)',
        foreground: 'var(--color-foreground)', // Often same as text, but can differ
        neutral: appColors.neutral as unknown as { [key: string]: string; },
        primary: 'var(--color-primary)',
        primaryFocus: 'var(--color-primary-focus)',
        secondary: 'var(--color-secondary)',
        success: 'var(--color-success)',
        text: 'var(--color-text)',
        warning: 'var(--color-warning)',
        // Direct mapping for neutral palette (could also be CSS vars if complex theming needed)

        // Keep original brand colors if needed for specific non-themed elements
      },
      fontFamily: {
        heading: ['Inter-Bold', 'system-ui', 'sans-serif'],
        sans: ['Inter-Regular', 'system-ui', 'sans-serif'],
      },
      // Add other theme extensions here (spacing, borderRadius, etc.)
    },
  },
} satisfies Config;
