// src/types/nativewind.d.ts
declare module 'nativewind/styled' {
  import { ComponentType } from 'react';
  import { SvgProps } from 'react-native-svg'; // Or other relevant props

  // Define a more generic type for the styled component
  // This might need adjustment based on the actual signature of NativeWind's styled HOC
  export function styled<P extends object>(
    Component: ComponentType<P>
  ): ComponentType<P & { className?: string; tw?: string }>;

  // You might need to add more specific overloads if you use styled with different component types
  // e.g., for SVG components if they have a different prop structure
  export function styled<P extends SvgProps>( // Example for SvgProps
    Component: ComponentType<P>
  ): ComponentType<P & { className?: string; tw?: string }>;
}
