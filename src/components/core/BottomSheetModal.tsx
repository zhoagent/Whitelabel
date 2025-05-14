/**
 * @fileoverview Provides a NativeWind-interoperable BottomSheetModal component.
 * @description This component leverages `@gorhom/bottom-sheet` and uses `cssInterop` from NativeWind to allow styling via the `className` prop. Bottom sheets are excellent for presenting contextual actions or information without navigating away from the current screen, enhancing user engagement and providing a modern UX (attraction).
 *
 * Key features using the stack:
 * - Wraps `@gorhom/react-native-bottom-sheet`'s `BottomSheetModal`.
 * - Enabled for NativeWind styling via `cssInterop`.
 * - A core UI component for dynamic and engaging interactions.
 *
 * @dependencies
 * - `@gorhom/bottom-sheet`
 * - `nativewind`
 *
 * @notes
 * - Requires `GestureHandlerRootView` and `BottomSheetModalProvider` higher up in the component tree (typically in a root or app layout).
 * - This component is crucial for creating polished, native-like interactions that can significantly boost user satisfaction and conversion.
 */
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { BottomSheetModal as OriginalBottomSheetModal } from '@gorhom/bottom-sheet';
import { cssInterop } from 'nativewind';

export const BottomSheetModal = cssInterop(OriginalBottomSheetModal, {
  className: {
    target: 'style',
  },
});

export type BottomSheetModal = OriginalBottomSheetModal;
