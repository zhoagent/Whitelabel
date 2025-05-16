export interface NeutralColorPalette {
50: string;
100: string;
200: string;
300: string;
400: string;
500: string;
600: string;
700: string;
800: string;
900: string;
950: string;
}
export interface ColorPalette {
accent: string;
background?: string; // e.g., 'var(--color-background)'
brand: {
black: string;
grey: string; // original grey
purple: string; // Keeping the original purple for reference
white: string;
};
error: string;
neutral: NeutralColorPalette;
primary: string;
primaryFocus: string; // For hover/focus states if not handled by opacity
secondary: string;
success: string;
text?: string; // e.g., 'var(--color-text)'
warning: string;
// These will be mapped to CSS variables for dynamic theming
// They are not direct colors but signal intent for tailwind.config.ts
// Specific brand colors can be added directly here
}
export const appColors: ColorPalette = {
accent: '#f59e0b', // Example: Amber
brand: {
black: '#111827', // Updated to a more standard dark (like neutral-900)
grey: '#e5e7eb', // Updated to a more standard light grey (like neutral-200)
purple: '#7e22ce',
white: '#ffffff',
},
error: '#ef4444', // Red
neutral: {
50: '#fafafa', // Very light grey / almost white
100: '#f4f4f5', // Light grey
200: '#e4e4e7', // Light grey
300: '#d4d4d8', // Light grey
400: '#a1a1aa', // Medium grey
500: '#71717a', // Medium grey
600: '#52525b', // Dark grey
700: '#3f3f46', // Dark grey
800: '#27272a', // Very dark grey
900: '#18181b', // Very dark grey / almost black
950: '#09090b', // Deepest black
},
primary: '#7e22ce', // Original purple, acts as primary
primaryFocus: '#6b21a8', // A darker shade of purple for focus
secondary: '#ec4899', // Example: Pink
success: '#10b981', // Green
warning: '#facc15', // Yellow
// These are placeholders to indicate they will be CSS variables
// The actual values for light/dark mode will be set in tailwind.config.ts
// background: 'var(--color-background)',
// text: 'var(--color-text)',
// Original colors for reference or specific use
};
// Type for keys of the main color object, excluding nested objects for direct mapping.
// This might not be as useful as before, given the structured palette.
export type AppColorName = keyof Omit<ColorPalette, 'neutral' | 'brand'>;
